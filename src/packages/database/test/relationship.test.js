// @flow


import { get, set } from '../relationship';

import range from '../../../utils/range';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type { Model } from '../index';

describe('module "database/relationship"', () => {
  let Tag: Class<Model>;
  let Post: Class<Model>;
  let User: Class<Model>;
  let Image: Class<Model>;
  let Comment: Class<Model>;
  let Categorization: Class<Model>;

  beforeAll(async () => {
    const { models } = await getTestApp();

    Tag = models.get('tag');
    Post = models.get('post');
    User = models.get('user');
    Image = models.get('image');
    Comment = models.get('comment');
    Categorization = models.get('categorization');
  });

  describe('#get()', () => {
    const instances = new Set();
    let subject;
    let subjectId;

    const setup = async () => {
      subject = await Post.create({
        title: '#get() test',
        userId: 1
      });

      subject = subject.unwrap();
      subjectId = subject.getPrimaryKey();

      await Post.transaction(async trx => {
        const [image, tags, comments] = await Promise.all([
          Image.transacting(trx).create({
            url: 'http://postlight.com',
            postId: subjectId
          }),
          Promise.all(
            Array.from(range(1, 5)).map(num => (
              Tag.transacting(trx).create({
                name: `New Tag ${num}`
              })
            ))
          ),
          Promise.all(
            Array.from(range(1, 5)).map(num => (
              Comment.transacting(trx).create({
                message: `New Comment ${num}`,
                userId: 2,
                postId: subjectId
              })
            ))
          )
        ]);

        const categorizations = await Promise.all(
          tags.map(tag => (
            Categorization.transacting(trx).create({
              tagId: tag.getPrimaryKey(),
              postId: subjectId
            })
          ))
        );

        instances.add(image);

        tags.forEach(tag => {
          instances.add(tag);
        });

        comments.forEach(comment => {
          instances.add(comment);
        });

        categorizations.forEach(categorization => {
          instances.add(categorization);
        });
      });
    };

    const teardown = () => subject.transaction(async trx => {
      await Promise.all([
        subject.transacting(trx).destroy(),
        ...Array
          .from(instances)
          .map(record => record.transacting(trx).destroy())
      ]);
    });

    describe('has-one relationships', () => {
      beforeEach(setup);
      afterEach(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'image');

        expect(result).toBeInstanceOf(Image);

        if (result instanceof Image) {
          expect(result.rawColumnData.postId).toBe(subjectId);
        }
      });
    });

    describe('belongs-to relationships', () => {
      beforeEach(setup);
      afterEach(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'user');

        expect(result).toBeInstanceOf(User);

        if (result instanceof User) {
          expect(result.getPrimaryKey()).toBe(1);
        }
      });
    });

    describe('one-to-many relationships', () => {
      beforeAll(setup);
      afterAll(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'comments');

        expect(result).toEqual(expect.any(Array));
        expect(result).toHaveLength(5);

        if (Array.isArray(result)) {
          result.forEach(comment => {
            expect(comment).toEqual(expect.any(Comment));
            expect(comment).toEqual(
              expect.objectContaining({
                rawColumnData: expect.objectContaining({
                  postId: subjectId,
                })
              })
            );
          });
        }
      });
    });

    describe('many-to-many relationships', () => {
      beforeAll(setup);
      afterAll(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'tags');

        expect(result).toEqual(expect.any(Array));
        expect(result).toHaveLength(5);

        if (Array.isArray(result)) {
          result.forEach(tag => {
            expect(tag).toBeInstanceOf(Tag);
          });

          const categorizations = await Promise.all(
            result.map(tag => (
              Categorization
                .first()
                .where({
                  tagId: tag.getPrimaryKey()
                })
            ))
          );

          expect(categorizations).toBeInstanceOf(Array);
          expect(categorizations).toHaveLength(5);

          categorizations.forEach(categorization => {
            expect(categorization).toBeInstanceOf(Categorization);
            expect(categorization.postId).toBe(subjectId);
          });
        }
      });
    });
  });

  describe('#set()', () => {
    const instances = new Set();
    let subject;
    let subjectId;

    const setup = async () => {
      subject = await Post.create({
        title: '#set() test'
      });

      subject = subject.unwrap();
      subjectId = subject.getPrimaryKey();
    };

    const teardown = () => subject.transaction(async trx => {
      await Promise.all([
        subject.transacting(trx).destroy(),
        ...Array
          .from(instances)
          .map(record => record.transacting(trx).destroy())
      ]);
    });

    describe('has-one relationships', () => {
      let image;

      beforeAll(async () => {
        image = await Image.create({
          url: 'http://postlight.com'
        });

        image = image.unwrap();

        instances.add(image);
        set(subject, 'image', image);
      });

      afterAll(teardown);

      it('can add a record to the relationship', async () => {
        expect(image.rawColumnData.postId).toBe(subjectId);
        expect(image.rawColumnData.post).toBeInstanceOf(Post);
      });
    });

    describe('belongs-to relationships', () => {
      let user;

      beforeAll(async () => {
        user = await User.create({
          name: 'Test User',
          email: 'test-user@postlight.com',
          password: 'test12345678'
        });

        user = user.unwrap();

        instances.add(user);
        set(subject, 'user', user);
      });

      afterAll(teardown);

      it('can add a record to the relationship', async () => {
        expect(subject.rawColumnData.userId).toBe(user.getPrimaryKey());
        expect(subject.rawColumnData.user).toBeInstanceOf(User);
      });

      it('can remove a record from the relationship', async () => {
        set(subject, 'user', null);

        expect(subject.rawColumnData.userId).toBe(null);

        return subject
          .reload()
          .include('user')
          .then(({ rawColumnData: { user } }) => {
            expect(user).toBeNull();
          });
      });
    });

    describe('one-to-many relationships', () => {
      let comments;

      beforeEach(async () => {
        comments = await Comment.transaction(trx => (
          Promise.all(
            [1, 2, 3].map(num => (
              Comment
                .transacting(trx)
                .create({
                  message: `Test Comment ${num}`
                })
                .then(record => record.unwrap())
            ))
          )
        ));

        comments.forEach(comment => {
          instances.add(comment);
        });

        set(subject, 'comments', comments);
      });

      afterEach(teardown);

      it('can add records to the relationship', () => {
        comments.forEach(comment => {
          expect(comment.postId).toBe(subjectId);
        });
      });

      it('can remove records from the relationship', () => {
        set(subject, 'comments', []);
        comments.forEach(comment => {
          expect(comment.postId).toBe(null);
        });
      });
    });
  });
});
