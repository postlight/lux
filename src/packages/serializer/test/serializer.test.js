// @flow
import * as faker from 'faker';
import { expect } from 'chai';
import { it, describe, before, beforeEach, afterEach } from 'mocha';
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

    const teardown = async () => {
      await Promise.all(
        Array.from(instances).map(record => {
          return record.destroy();
        })
      );
    };

    before(async () => {
      const { models } = await getTestApp();
      // $FlowIgnore
      const Tag = models.get('tag');
      // $FlowIgnore
      const Post = models.get('post');
      // $FlowIgnore
      const User = models.get('user');
      // $FlowIgnore
      const Image = models.get('image');
      // $FlowIgnore
      const Comment = models.get('comment');
      // $FlowIgnore
      const Categorization = models.get('categorization');

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
      } = {}) => {
        let include = [];

        const post = await Post.create({
          body: faker.lorem.paragraphs(),
          title: faker.lorem.sentence(),
          isPublic: faker.random.boolean()
        });

        const postId = post.getPrimaryKey();

        if (includeUser) {
          const user = await User.create({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: faker.internet.password(8)
          });

          instances.add(user);
          include = [...include, 'user'];

          Reflect.set(post, 'user', user);
        }

        if (includeImage) {
          const image = await Image.create({
            postId,
            url: faker.image.imageUrl()
          });

          instances.add(image);
          include = [...include, 'image'];
        }

        if (includeTags) {
          const tags = await Promise.all([
            Tag.create({
              name: faker.lorem.word()
            }),
            Tag.create({
              name: faker.lorem.word()
            }),
            Tag.create({
              name: faker.lorem.word()
            })
          ]);

          const categorizations = await Promise.all(
            tags.map(tag => {
              return Categorization.create({
                postId,
                tagId: tag.getPrimaryKey()
              });
            })
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
            Comment.create({
              postId,
              message: faker.lorem.sentence()
            }),
            Comment.create({
              postId,
              message: faker.lorem.sentence()
            }),
            Comment.create({
              postId,
              message: faker.lorem.sentence()
            })
          ]);

          comments.forEach(comment => {
            instances.add(comment);
          });

          include = [...include, 'comments'];
        }

        await post.save(true);

        return await Post
          .find(postId)
          .include(...include);
      };
    });

    describe('#format()', function () {
      this.timeout(15000);

      beforeEach(setup);
      afterEach(teardown);

      const expectResourceToBeCorrect = async (
        post,
        result,
        includeImage = true
      ) => {
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
          Reflect.get(post, 'user'),
          Reflect.get(post, 'tags'),
          Reflect.get(post, 'image'),
          Reflect.get(post, 'comments')
        ]);

        const postId = post.getPrimaryKey();
        const userId = user.getPrimaryKey();
        const imageId = image ? image.getPrimaryKey() : null;

        const tagIds = tags
          .map(tag => tag.getPrimaryKey())
          .map(String);

        const commentIds = comments
          .map(comment => comment.getPrimaryKey())
          .map(String);

        expect(result).to.have.property('id', `${postId}`);
        expect(result).to.have.property('type', 'posts');
        expect(attributes).to.be.an('object');
        expect(relationships).to.be.an('object');
        expect(attributes).to.have.property('body', body);
        expect(attributes).to.have.property('title', title);
        expect(attributes).to.have.property('is-public', isPublic);
        expect(attributes).to.have.property('created-at', createdAt);
        expect(attributes).to.have.property('updated-at', updatedAt);

        let userLink;

        if (subject.namespace) {
          userLink = linkFor(`${subject.namespace}/users`, userId);
        } else {
          userLink = linkFor('users', userId);
        }

        expect(relationships).to.have.property('user').and.be.an('object');
        expect(relationships.user).to.deep.equal({
          data: {
            id: `${userId}`,
            type: 'users'
          },
          links: {
            self: userLink
          }
        });

        if (includeImage) {
          let imageLink;

          if (subject.namespace) {
            imageLink = linkFor(`${subject.namespace}/images`, imageId);
          } else {
            imageLink = linkFor('images', imageId);
          }

          expect(relationships).to.have.property('image').and.be.an('object');
          expect(relationships.image).to.deep.equal({
            data: {
              id: `${image.getPrimaryKey()}`,
              type: 'images'
            },
            links: {
              self: imageLink
            }
          });
        } else {
          expect(relationships.image).to.be.null;
        }

        expect(relationships)
          .to.have.property('tags')
          .and.have.property('data')
          .and.be.an('array')
          .with.lengthOf(tags.length);

        relationships.tags.data.forEach(tag => {
          expect(tag).to.have.property('id').and.be.oneOf(tagIds);
          expect(tag).to.have.property('type').and.equal('tags');
        });

        expect(relationships)
          .to.have.property('comments')
          .and.have.property('data')
          .and.be.an('array')
          .with.lengthOf(comments.length);

        relationships.comments.data.forEach(comment => {
          expect(comment).to.have.property('id').and.be.oneOf(commentIds);
          expect(comment).to.have.property('type').and.equal('comments');
        });
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

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi'
        ]);

        await expectResourceToBeCorrect(post, result.data);

        expect(result).to.have.property('links').and.deep.equal({
          self: linkFor('posts', post.getPrimaryKey())
        });

        expect(result).to.have.property('jsonapi').and.deep.equal({
          version: JSONAPI_VERSION
        });
      });

      it('works with an array of `Model` instances', async function () {
        this.slow(13 * 1000);
        this.timeout(25 * 1000);

        const posts = await Promise.all(
          Array.from(range(1, 25)).map(() => {
            return createPost();
          })
        );

        const postIds = posts
          .map(post => post.getPrimaryKey())
          .map(String);

        const result = await subject.format({
          data: posts,
          domain: DOMAIN,
          include: [],
          links: {
            self: linkFor('posts')
          }
        });

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi'
        ]);

        expect(result.data).to.be.an('array').with.lengthOf(posts.length);

        for (let i = 0; i < result.data.length; i++) {
          await expectResourceToBeCorrect(posts[i], result.data[i]);
        }

        expect(result).to.have.property('links').and.deep.equal({
          self: linkFor('posts')
        });

        expect(result).to.have.property('jsonapi').and.deep.equal({
          version: JSONAPI_VERSION
        });
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

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi'
        ]);

        await expectResourceToBeCorrect(post, result.data);

        expect(result).to.have.property('links').and.deep.equal({
          self: linkFor('admin/posts', post.getPrimaryKey())
        });

        expect(result).to.have.property('jsonapi').and.deep.equal({
          version: JSONAPI_VERSION
        });
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

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi'
        ]);

        await expectResourceToBeCorrect(post, result.data, false);

        expect(result).to.have.property('links').and.deep.equal({
          self: linkFor('posts', post.getPrimaryKey())
        });

        expect(result).to.have.property('jsonapi').and.deep.equal({
          version: JSONAPI_VERSION
        });
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

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi',
          'included'
        ]);

        await expectResourceToBeCorrect(post, result.data);

        expect(result.included).to.be.an('array').with.lengthOf(1);

        const { included: [item] } = result;

        expect(item).to.have.property('id', `${image.getPrimaryKey()}`);
        expect(item).to.have.property('type', 'images');
        expect(item).to.have.property('attributes').and.be.an('object');
        expect(item.attributes).to.have.property('url', image.url);
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

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi',
          'included'
        ]);

        await expectResourceToBeCorrect(post, result.data);

        expect(result.included).to.be.an('array').with.lengthOf(1);

        const { included: [item] } = result;

        expect(item).to.have.property('id', `${user.getPrimaryKey()}`);
        expect(item).to.have.property('type', 'users');
        expect(item).to.have.property('attributes').and.be.an('object');
        expect(item.attributes).to.have.property('name', user.name);
        expect(item.attributes).to.have.property('email', user.email);
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

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi',
          'included'
        ]);

        await expectResourceToBeCorrect(post, result.data);

        expect(result.included)
          .to.be.an('array')
          .with.lengthOf(comments.length);

        result.included.forEach(item => {
          expect(item).to.have.all.keys([
            'id',
            'type',
            'links',
            'attributes'
          ]);

          expect(item).to.have.property('id').and.be.a('string');
          expect(item).to.have.property('type', 'comments');
          expect(item).to.have.property('attributes').and.be.an('object');
        });
      });

      it('supports including a many-to-many relationship', async () => {
        const post = await createPost();
        const tags = await Reflect.get(post, 'tags');
        const result = await subject.format({
          data: post,
          domain: DOMAIN,
          include: ['tags'],
          links: {
            self: linkFor('posts', post.getPrimaryKey())
          }
        });

        expect(result).to.have.all.keys([
          'data',
          'links',
          'jsonapi',
          'included'
        ]);

        await expectResourceToBeCorrect(post, result.data);

        expect(result.included)
          .to.be.an('array')
          .with.lengthOf(tags.length);

        result.included.forEach(item => {
          expect(item).to.have.all.keys([
            'id',
            'type',
            'links',
            'attributes'
          ]);

          expect(item).to.have.property('id').and.be.a('string');
          expect(item).to.have.property('type', 'tags');
          expect(item).to.have.property('attributes').and.be.an('object');
        });
      });
    });
  });
});
