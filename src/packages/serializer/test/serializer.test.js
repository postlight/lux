// @flow
import * as faker from 'faker';

import { dasherize, underscore } from 'inflection';

import Serializer from '../index';
import { VERSION as JSONAPI_VERSION } from '../../jsonapi';

import range from '../../../utils/range';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type Application from '../../application';
import type { Model } from '../../database';

import type {
  JSONAPI$DocumentLinks,
  JSONAPI$ResourceObject,
  JSONAPI$IdentifierObject
} from '../../jsonapi';

const DOMAIN = 'http://localhost:4000';

const linkFor = (type, id) => (
  id ? `${DOMAIN}/${type}/${id}` : `${DOMAIN}/${type}`
);

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

    describe('#format()', function () {
      this.timeout(20 * 1000);

      beforeEach(setup);
      afterEach(teardown);

      const expectResourceToBeCorrect = async (
        post,
        result,
        includeImage = true
      ) => {
        const { namespace } = subject;
        const { attributes, relationships } = result;
        const {
          body,
          title,
          isPublic,
          createdAt,
          updatedAt
        } = post.getAttributes(
          'body',
          'title',
          'isPublic',
          'createdAt',
          'updatedAt'
        );

        const [
          user,
          tags,
          image,
          comments
        ] = await Promise.all([
          post.user,
          post.tags,
          post.image,
          post.comments,
        ]);

        const postId = post.getPrimaryKey();
        const userId = user.getPrimaryKey();

        expect(result).toEqual(
          expect.objectContaining({
            id: String(postId),
            type: 'posts',
            attributes: expect.objectContaining({
              body,
              title,
              'is-public': isPublic,
              'created-at': createdAt,
              'updated-at': updatedAt,
            }),
            relationships: expect.objectContaining({
              user: expect.objectContaining({
                data: {
                  id: String(userId),
                  type: 'users',
                },
                links: {
                  self: (() => {
                    if (namespace) {
                      return linkFor(`${namespace}/users`, userId);
                    }
                    return linkFor('users', userId);
                  })(),
                },
              }),
              image: (() => {
                if (includeImage) {
                  const imageId = image.getPrimaryKey();

                  return expect.objectContaining({
                    data: {
                      id: String(imageId),
                      type: 'images',
                    },
                    links: {
                      self: (() => {
                        if (namespace) {
                          return linkFor(`${namespace}/images`, imageId);
                        }
                        return linkFor('images', imageId);
                      })(),
                    }
                  });
                }
                return expect.objectContaining({
                  data: null,
                });
              })(),
              tags: expect.arrayContaining(
                tags.reduce((arr, tag) => [
                  ...arr,
                  expect.objectContaining({
                    data: {
                      id: String(tag.getPrimaryKey()),
                      type: 'tags',
                    },
                  }),
                ], [])
              ),
              comments: expect.arrayContaining(
                comments.reduce((arr, comment) => [
                  ...arr,
                  expect.objectContaining({
                    data: {
                      id: String(comment.getPrimaryKey()),
                      type: 'comments',
                    },
                  }),
                ], [])
              ),
            }),
          })
        );
      };

      it('works with a single instance of `Model`', async () => {
        const post = await createPost();
        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: [],
          links: {
            self: linkFor('posts', post.getPrimaryKey())
          }
        });

        expect(result).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            links: {
              self: linkFor('posts', post.getPrimaryKey()),
            },
            jsonapi: {
              version: JSONAPI_VERSION,
            },
          })
        );

        await expectResourceToBeCorrect(post, result.data);
      });

      it('works with an array of `Model` instances', async () => {
        const posts = await subject.model.transaction(trx => (
          Promise.all(
            Array.from(range(1, 25)).map(() => createPost({}, trx))
          )
        ));

        const result = await subject.format({
          data: posts,
          domain: DOMAIN,
          include: [],
          links: {
            self: linkFor('posts')
          }
        });

        expect(result).toEqual(
          expect.objectContaining({
            data: expect.any(Array),
            links: {
              self: linkFor('posts'),
            },
            jsonapi: {
              version: JSONAPI_VERSION,
            },
          })
        );

        expect(result.data).toHaveLength(posts.length);

        await Promise.all(
          result.data.map((item, idx) => (
            expectResourceToBeCorrect(posts[idx], item)
          ))
        );
      });

      it('can build namespaced links', async () => {
        subject = createSerializer('admin');

        const post = await createPost();
        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: [],
          links: {
            self: linkFor('admin/posts', post.getPrimaryKey())
          }
        });

        expect(result).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            links: {
              self: linkFor('admin/posts', post.getPrimaryKey()),
            },
            jsonapi: {
              version: JSONAPI_VERSION,
            },
          })
        );

        await expectResourceToBeCorrect(post, result.data);
      });

      it('supports empty one-to-one relationships', async () => {
        const post = await createPost({
          includeUser: true,
          includeTags: true,
          includeImage: false,
          includeComments: true
        });

        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: [],
          links: {
            self: linkFor('posts', post.getPrimaryKey())
          }
        });

        expect(result).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            links: {
              self: linkFor('posts', post.getPrimaryKey()),
            },
            jsonapi: {
              version: JSONAPI_VERSION,
            },
          })
        );

        await expectResourceToBeCorrect(post, result.data, false);
      });

      it('supports including a has-one relationship', async () => {
        const post = await createPost();
        const image = await Reflect.get(post, 'image');
        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: ['image'],
          links: {
            self: linkFor('posts', post.getPrimaryKey())
          }
        });

        expect(result).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            links: {
              self: linkFor('posts', post.getPrimaryKey()),
            },
            jsonapi: {
              version: JSONAPI_VERSION,
            },
            included: expect.arrayContaining([
              expect.objectContaining({
                id: String(image.getPrimaryKey()),
                type: 'images',
                attributes: expect.objectContaining({
                  url: image.url,
                }),
              })
            ]),
          })
        );

        await expectResourceToBeCorrect(post, result.data);
      });

      it('supports including belongs-to relationships', async () => {
        const post = await createPost();
        const user = await Reflect.get(post, 'user');
        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: ['user'],
          links: {
            self: linkFor('posts', post.getPrimaryKey())
          }
        });

        expect(result).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            links: {
              self: linkFor('posts', post.getPrimaryKey()),
            },
            jsonapi: {
              version: JSONAPI_VERSION,
            },
            included: expect.arrayContaining([
              expect.objectContaining({
                id: String(user.getPrimaryKey()),
                type: 'users',
                attributes: expect.objectContaining({
                  name: user.name,
                  email: user.email,
                }),
              })
            ]),
          })
        );

        await expectResourceToBeCorrect(post, result.data);
      });

      it('supports including a one-to-many relationship', async () => {
        const post = await createPost();
        const comments = await Reflect.get(post, 'comments');
        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: ['comments'],
          links: {
            self: linkFor('posts', post.getPrimaryKey())
          }
        });

        expect(result).toEqual(
          expect.objectContaining({
            data: expect.any(Object),
            links: {
              self: linkFor('posts', post.getPrimaryKey()),
            },
            jsonapi: {
              version: JSONAPI_VERSION,
            },
            included: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                type: 'comments',
                attributes: expect.any(Object),
              }),
              expect.objectContaining({
                id: expect.any(String),
                type: 'comments',
                attributes: expect.any(Object),
              }),
              expect.objectContaining({
                id: expect.any(String),
                type: 'comments',
                attributes: expect.any(Object),
              }),
            ]),
          })
        );

        await expectResourceToBeCorrect(post, result.data);
      });

      it('supports including a many-to-many relationship', async () => {
        const post = await createPost();

        await post.reload().include('tags');

        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: ['tags'],
          links: {
            self: linkFor('posts', post.getPrimaryKey())
          }
        });

        await expectResourceToBeCorrect(post, result.data);

        expect(result).toEqual({
          data: expect.any(Object),
          links: expect.any(Object),
          jsonapi: { verison: JSONAPI_VERSION },
          included: expect.any(Array),
        });

        result.included.forEach(item => {
          expect(item).toEqual({
            id: expect.any(String),
            type: 'tags',
            links: expect.any(Object),
            attributes: expect.any(Object),
          });
        });
      });
    });
  });
});
