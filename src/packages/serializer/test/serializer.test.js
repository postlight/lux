// @flow
import * as faker from 'faker';

import { dasherize, underscore } from 'inflection';

import Serializer from '../index';
import { VERSION as JSONAPI_VERSION } from '../../jsonapi';

import range from '../../../utils/range';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type Application from '../../application';
import type { Model } from '../../database';

const DOMAIN = 'http://localhost:4000';

const linkFor = (type, id) => (
  id ? `${DOMAIN}/${type}/${id}` : `${DOMAIN}/${type}`
);

jasmine.DEFAULT_TIMEOUT_INTERVAL = 20 * 1000;

describe('module "serializer"', () => {
  describe('class Serializer', () => {
    let subject;
    let createPost;
    let createSerializer;
    const instances = new Set();

    const setup = () => {
      subject = createSerializer();
    };

    const teardown = () => subject.model.transaction(async trx => {
      const promises = Array
        .from(instances)
        .map(record => record.transacting(trx).destroy());

      await Promise.all(promises);
    });

    beforeAll(async () => {
      const { models } = await getTestApp();
      const Tag = models.get('tag');
      const Post = models.get('post');
      const User = models.get('user');
      const Image = models.get('image');
      const Comment = models.get('comment');
      const Categorization = models.get('categorization');

      if (!Post) {
        throw new Error('Could not find model "Post".');
      }

      class TestSerializer extends Serializer {
        attributes = [
          'body',
          'title',
          'isPublic',
          'createdAt',
          'updatedAt'
        ];

        hasOne = [
          'user',
          'image'
        ];

        hasMany = [
          'comments',
          'tags'
        ];
      }

      createSerializer = (namespace = '') => new TestSerializer({
        namespace,
        model: Post,
        parent: null
      });

      createPost = async ({
        includeUser = true,
        includeTags = true,
        includeImage = true,
        includeComments = true
      } = {}, transaction) => {
        let include = [];
        const run = async trx => {
          const post = await Post.transacting(trx).create({
            body: faker.lorem.paragraphs(),
            title: faker.lorem.sentence(),
            isPublic: faker.random.boolean()
          });

          const postId = post.getPrimaryKey();

          if (includeUser) {
            const user = await User.transacting(trx).create({
              name: `${faker.name.firstName()} ${faker.name.lastName()}`,
              email: faker.internet.email(),
              password: faker.internet.password(8)
            });

            instances.add(user);
            include = [...include, 'user'];

            Reflect.set(post, 'user', user);
          }

          if (includeImage) {
            const image = await Image.transacting(trx).create({
              postId,
              url: faker.image.imageUrl()
            });

            instances.add(image);
            include = [...include, 'image'];
          }

          if (includeTags) {
            const tags = await Promise.all([
              Tag.transacting(trx).create({
                name: faker.lorem.word()
              }),
              Tag.transacting(trx).create({
                name: faker.lorem.word()
              }),
              Tag.transacting(trx).create({
                name: faker.lorem.word()
              })
            ]);

            const categorizations = await Promise.all(
              tags.map(tag => (
                Categorization.transacting(trx).create({
                  postId,
                  tagId: tag.getPrimaryKey()
                })
              ))
            );

            tags.forEach(tag => {
              instances.add(tag);
            });

            categorizations.forEach(categorization => {
              instances.add(categorization);
            });

            include = [...include, 'tags'];
          }

          if (includeComments) {
            const comments = await Promise.all([
              Comment.transacting(trx).create({
                postId,
                message: faker.lorem.sentence()
              }),
              Comment.transacting(trx).create({
                postId,
                message: faker.lorem.sentence()
              }),
              Comment.transacting(trx).create({
                postId,
                message: faker.lorem.sentence()
              })
            ]);

            comments.forEach(comment => {
              instances.add(comment);
            });

            include = [...include, 'comments'];
          }

          await post.transacting(trx).save();

          return post.unwrap();
        };

        if (transaction) {
          return await run(transaction);
        }

        return await Post.transaction(run);
      };
    });

    describe('#format()', () => {
      beforeEach(setup);
      afterEach(teardown);

      it('works with a single instance of `Model`', async () => {
        const post = await createPost();

        expect(
          await subject.format({
            data: post,
            domain: DOMAIN,
            include: [],
            links: {
              self: linkFor('posts', post.getPrimaryKey())
            }
          })
        ).toMatchSnapshot();
      });

      it('works with an array of `Model` instances', async () => {
        const posts = await subject.model.transaction(trx => (
          Promise.all(
            Array.from(range(1, 25)).map(() => createPost({}, trx))
          )
        ));

        expect(
          await subject.format({
            data: posts,
            domain: DOMAIN,
            include: [],
            links: {
              self: linkFor('posts')
            }
          })
        ).toMatchSnapshot();
      });

      it('can build namespaced links', async () => {
        subject = createSerializer('admin');

        const post = await createPost();

        expect(
          await subject.format({
            data: post,
            domain: DOMAIN,
            include: [],
            links: {
              self: linkFor('admin/posts', post.getPrimaryKey())
            }
          })
        ).toMatchSnapshot();
      });

      it('supports empty one-to-one relationships', async () => {
        const post = await createPost({
          includeUser: true,
          includeTags: true,
          includeImage: false,
          includeComments: true
        });

        expect(
          await subject.format({
            data: post,
            domain: DOMAIN,
            include: [],
            links: {
              self: linkFor('posts', post.getPrimaryKey())
            }
          })
        ).toMatchSnapshot();
      });

      it('supports including a has-one relationship', async () => {
        const post = await createPost();
        const image = await Reflect.get(post, 'image');

        expect(
          await subject.format({
            data: post,
            domain: DOMAIN,
            include: ['image'],
            links: {
              self: linkFor('posts', post.getPrimaryKey())
            }
          })
        ).toMatchSnapshot();
      });

      it('supports including belongs-to relationships', async () => {
        const post = await createPost();
        const user = await Reflect.get(post, 'user');

        expect(
          await subject.format({
            data: post,
            domain: DOMAIN,
            include: ['user'],
            links: {
              self: linkFor('posts', post.getPrimaryKey())
            }
          })
        ).toMatchSnapshot();
      });

      it('supports including a one-to-many relationship', async () => {
        const post = await createPost();
        const comments = await Reflect.get(post, 'comments');

        expect(
          await subject.format({
            data: post,
            domain: DOMAIN,
            include: ['comments'],
            links: {
              self: linkFor('posts', post.getPrimaryKey())
            }
          })
        ).toMatchSnapshot();
      });

      it('supports including a many-to-many relationship', async () => {
        const post = await createPost();

        await post
          .reload()
          .include('tags');

        expect(
          await subject.format({
            data: post,
            domain: DOMAIN,
            include: ['tags'],
            links: {
              self: linkFor('posts', post.getPrimaryKey())
            }
          })
        ).toMatchSnapshot();
      });
    });
  });
});
