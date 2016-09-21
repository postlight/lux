// @flow
import { expect } from 'chai';
import { it, describe, before, beforeEach, afterEach } from 'mocha';

import { get, set } from '../relationship';

import range from '../../../utils/range';
import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type { Model } from '../index';

describe('module "database/relationship"', () => {
  let Tag: Class<Model>;
  let Post: Class<Model>;
  let User: Class<Model>;
  let Image: Class<Model>;
  let Comment: Class<Model>;
  let Categorization: Class<Model>;

  before(async () => {
    const { models } = await getTestApp();

    Tag = setType(() => models.get('tag'));
    Post = setType(() => models.get('post'));
    User = setType(() => models.get('user'));
    Image = setType(() => models.get('image'));
    Comment = setType(() => models.get('comment'));
    Categorization = setType(() => models.get('categorization'));
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

      subjectId = subject.getPrimaryKey();

      const [image, tags, comments] = await Promise.all([
        Image.create({
          url: 'http://postlight.com',
          postId: subjectId
        }),
        Promise.all(
          Array.from(range(1, 5)).map(num => {
            return Tag.create({
              name: `New Tag ${num}`
            });
          })
        ),
        Promise.all(
          Array.from(range(1, 5)).map(num => {
            return Comment.create({
              message: `New Comment ${num}`,
              userId: 2,
              postId: subjectId
            });
          })
        )
      ]);

      const categorizations = await Promise.all(
        tags.map(tag => {
          return Categorization.create({
            tagId: tag.getPrimaryKey(),
            postId: subjectId
          });
        })
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
    };

    const teardown = async () => {
      await Promise.all([
        subject.destroy(),
        ...Array.from(instances).map(record => {
          return record.destroy();
        })
      ]);
    };

    describe('has-one relationships', () => {
      beforeEach(setup);
      afterEach(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'image');

        expect(result).to.be.an.instanceof(Image);
        expect(result).to.have.property('postId', subjectId);
      });
    });

    describe('belongs-to relationships', () => {
      beforeEach(setup);
      afterEach(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'user');

        expect(result).to.be.an.instanceof(User);
        expect(result).to.have.property('id', 1);
      });
    });

    describe('one-to-many relationships', () => {
      beforeEach(setup);
      afterEach(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'comments');

        expect(result).to.be.an('array').with.lengthOf(5);

        if (Array.isArray(result)) {
          result.forEach(comment => {
            expect(comment).to.be.an.instanceof(Comment);
            expect(comment).to.have.property('postId', subjectId);
          });
        }
      });
    });

    describe('many-to-many relationships', () => {
      beforeEach(setup);
      afterEach(teardown);

      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'tags');

        expect(result).to.be.an('array').with.lengthOf(5);

        if (Array.isArray(result)) {
          result.forEach(tag => {
            expect(tag).to.be.an.instanceof(Tag);
          });

          const categorizations = await Promise.all(
            result.map(tag => {
              const tagId = tag.getPrimaryKey();

              return Categorization.first().where({
                tagId
              });
            })
          );

          expect(categorizations).to.be.an('array').with.lengthOf(5);

          categorizations.forEach(categorization => {
            expect(categorization).to.be.an.instanceof(Categorization);
            expect(categorization).to.have.property('postId', subjectId);
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

      subjectId = subject.getPrimaryKey();
    };

    const teardown = async () => {
      await Promise.all([
        subject.destroy(),
        ...Array.from(instances).map(record => {
          return record.destroy();
        })
      ]);
    };

    describe('has-one relationships', () => {
      let image;

      beforeEach(async () => {
        await setup();

        image = await Image.create({
          url: 'http://postlight.com'
        });

        set(subject, 'image', image);
      });

      afterEach(teardown);

      it('can add a record to the relationship', async () => {
        expect(image).to.have.property('postId', subjectId);
        expect(await Reflect.get(image, 'post')).be.an.instanceof(Post);
      });
    });

    describe('belongs-to relationships', () => {
      let user;

      beforeEach(async () => {
        await setup();

        user = await User.create({
          name: 'Test User',
          email: 'test-user@postlight.com',
          password: 'test12345678'
        });

        instances.add(user);
        set(subject, 'user', user);
      });

      afterEach(teardown);

      it('can add a record to the relationship', async () => {
        expect(subject).to.have.property('userId', user.getPrimaryKey());
        expect(await Reflect.get(subject, 'user')).to.be.an.instanceof(User);
      });

      it('can remove a record from the relationship', async () => {
        set(subject, 'user', null);

        expect(subject).to.have.property('userId', null);
        expect(await Reflect.get(subject, 'user')).to.be.null;
      });
    });

    describe('one-to-many relationships', () => {
      let comments;

      beforeEach(async () => {
        await setup();

        comments = await Promise.all([
          Comment.create({
            message: 'Test Comment 1'
          }),
          Comment.create({
            message: 'Test Comment 2'
          }),
          Comment.create({
            message: 'Test Comment 3'
          })
        ]);

        comments.forEach(comment => {
          instances.add(comment);
        });

        set(subject, 'comments', comments);
      });

      afterEach(teardown);

      it('can add records to the relationship', () => {
        comments.forEach(comment => {
          expect(comment).to.have.property('postId', subjectId);
        });
      });

      it('can remove records from the relationship', () => {
        set(subject, 'comments', []);

        comments.forEach(comment => {
          expect(comment).to.have.property('postId', null);
        });
      });
    });
  });
});
