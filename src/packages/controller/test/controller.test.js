// @flow
import faker from 'faker';

import { MIME_TYPE } from '../../jsonapi';
import Controller from '../index';
import Serializer from '../../serializer';
import * as Adapters from '../../adapter';
import noop from '../../../utils/noop';
import { getTestApp } from '../../../../test/utils/get-test-app';

const HOST = 'localhost:4000';
const DEFAULT_FIELDS = {
  posts: [
    'body',
    'title',
    'createdAt',
    'updatedAt',
  ],
  users: [
    'id',
  ],
  images: [
    'id',
  ],
  comments: [
    'id',
  ],
  reactions: [
    'id',
  ],
  tags: [
    'id',
  ],
};

describe('module "controller"', () => {
  describe('class Controller', () => {
    let Post;
    let subject;
    let adapter;

    const getDefaultProps = () => ({
      id: expect.anything(),
      title: expect.any(String),
      isPublic: expect.any(Boolean),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });

    const assertRecord = (item, props = getDefaultProps()) => {
      expect(item).toBeInstanceOf(Post);

      if (item instanceof Post) {
        expect(item.toObject()).toEqual(
          expect.objectContaining(props)
        );
      }
    };

    beforeAll(async () => {
      const app = await getTestApp();

      Post = app.store.modelFor('post');
      adapter = Adapters.mock(app);
      subject = new Controller({
        model: Post,
        namespace: '',
        serializer: new Serializer({
          model: Post,
          parent: null,
          namespace: ''
        })
      });

      subject.controllers = app.controllers;
    });

    describe('#index()', () => {
      const mockArgs = async (query = '') => {
        const [request, response] = await adapter({
          url: `/posts${query}`,
          method: 'GET',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        });

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: DEFAULT_FIELDS,
          page: {
            size: 25,
            number: 1,
          },
        });

        return [request, response];
      };

      it('returns an array of records', async () => {
        const [request, response] = await mockArgs();
        const result = await subject.index(request, response);

        expect(result).toBeInstanceOf(Array);
        result.forEach(item => assertRecord(item));
      });

      it('supports specifying page size', async () => {
        const [request, response] = await mockArgs('?page[size]=10');
        const result = await subject.index(request, response);

        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(10);
        result.forEach(item => assertRecord(item));
      });

      it('supports filter parameters', async () => {
        const [request, response] = await mockArgs('?filter[is-public]=false');
        const result = await subject.index(request, response);

        expect(result).toBeInstanceOf(Array);
        result.forEach(item => {
          assertRecord(item, {
            ...getDefaultProps(),
            isPublic: false,
          });
        });
      });

      it('supports sparse field sets', async () => {
        const [request, response] = await mockArgs('?fields[posts]=id,title');
        const result = await subject.index(request, response);

        expect(result).toBeInstanceOf(Array);
        result.forEach(item => {
          const { id, title } = getDefaultProps();

          assertRecord(item, {
            id,
            title,
          });
        });
      });

      it('supports eager loading relationships', async () => {
        const [request, response] = await mockArgs('?include=user');
        const result = await subject.index(request, response);

        expect(result).toBeInstanceOf(Array);
        result.forEach(item => {
          assertRecord(item, {
            ...getDefaultProps(),
            user: expect.objectContaining({
              id: expect.anything(),
              name: expect.any(String),
              email: expect.any(String),
            }),
          });
        });
      });
    });

    describe('#show()', () => {
      const mockArgs = async (id, query = '') => {
        const [request, response] = await adapter({
          url: `/posts/${id}${query}`,
          method: 'GET',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        });

        Object.assign(request.params, {
          id,
        });

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        });

        return [request, response];
      };

      it('returns a single record', async () => {
        const [request, response] = await mockArgs(1);

        assertRecord(await subject.show(request, response));
      });

      it('throws an error if the record is not found', async () => {
        const [request, response] = await mockArgs(10000);

        await subject
          .show(request, response)
          .catch(err => {
            expect(err).toEqual(expect.any(Error));
          });
      });

      it('supports sparse field sets', async () => {
        const { id, title } = getDefaultProps();
        const [request, response] = await mockArgs(
          1,
          '?fields[posts]=id,title'
        );

        assertRecord(await subject.show(request, response), {
          id,
          title,
        });
      });

      it('supports eager loading relationships', async () => {
        const [request, response] = await mockArgs(1, '?include=user');

        assertRecord(await subject.show(request, response), {
          ...getDefaultProps(),
          user: expect.objectContaining({
            id: expect.anything(),
            name: expect.any(String),
            email: expect.any(String),
          }),
        });
      });
    });

    describe('#create()', () => {
      let result;

      const mockArgs = async params => {
        const [request, response] = await adapter({
          url: '/posts',
          method: 'POST',
          headers: {
            Host: HOST,
            'Content-Type': MIME_TYPE,
          },
          resolve: noop,
        });

        Object.assign(request.params, params);

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        });

        return [request, response];
      };

      afterEach(async () => {
        await result.destroy();
      });

      it('returns the newly created record', async () => {
        const title = '#create() Test';
        const isPublic = true;
        const [request, response] = await mockArgs({
          data: {
            type: 'posts',
            attributes: {
              title,
              isPublic,
            },
          },
          include: [
            'user',
          ],
        });

        result = await subject.create(request, response);

        assertRecord(result, {
          ...getDefaultProps(),
          title,
          isPublic,
        });
      });

      it('sets `response.statusCode` to the number `201`', async () => {
        const [request, response] = await mockArgs({
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test',
            },
          },
        });

        result = await subject.create(request, response);

        expect(response.statusCode).toBe(201);
      });

      it('sets the correct `Location` header', async () => {
        const [request, response] = await mockArgs({
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test',
            },
          },
        });

        result = await subject.create(request, response);

        expect(
          response.headers.get('location')
        ).toBe(`http://${HOST}/posts/${result.getPrimaryKey()}`);
      });
    });

    describe('#update()', () => {
      let User;
      let record;

      const getDefaultParams = () => ({
        type: 'posts',
        data: {
          attributes: {
            title: '#update() Test',
          },
        },
      });

      const mockArgs = async (id, params = getDefaultParams()) => {
        const [request, response] = await adapter({
          url: `/posts/${id}`,
          method: 'PATCH',
          headers: {
            Host: HOST,
            'Content-Type': MIME_TYPE,
          },
          resolve: noop,
        });

        Object.assign(request.params, params, {
          id,
        });

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        });

        return [request, response];
      };

      beforeEach(async () => {
        const { store } = await getTestApp();

        User = store.modelFor('user');
        record = await Post
          .create({ title: '#update() Test' })
          .then(post => post.unwrap());
      });

      afterEach(async () => {
        await record.destroy();
      });

      it('returns a record if attribute(s) change', async () => {
        const id = record.getPrimaryKey();
        const isPublic = true;
        const [request, response] = await mockArgs(id, {
          type: 'posts',
          data: {
            attributes: {
              isPublic,
            },
          },
        });

        // $FlowIgnore
        expect(record.isPublic).toBe(!isPublic);
        assertRecord(await subject.update(request, response), {
          ...getDefaultProps(),
          id,
          isPublic,
        });
      });

      it('returns a record if relationships(s) change', async () => {
        const id = record.getPrimaryKey();

        const newUser = await (async () => {
          const result = await User.create({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: faker.internet.password(8),
          });

          return result.unwrap();
        })();

        const [request, response] = await mockArgs(id, {
          type: 'posts',
          data: {
            relationships: {
              user: {
                data: {
                  id: newUser.getPrimaryKey(),
                  type: 'users',
                },
              },
            },
          },
        });

        const [user, comments] = await Promise.all([
          // $FlowIgnore
          record.user,
          // $FlowIgnore
          record.comments,
        ]);

        expect(user).toBeNull();
        expect(comments).toEqual([]);

        await subject.update(request, response);

        record = await Post
          .find(id)
          .include('user');

        assertRecord(record, {
          ...getDefaultProps(),
          id,
          user: expect.objectContaining(
            newUser.getAttributes('id', 'name', 'email')
          ),
        });

        await newUser.destroy();
      });

      it('returns the number `204` if no changes occur', async () => {
        const [request, response] = await mockArgs(record.getPrimaryKey());

        expect(await subject.update(request, response)).toBe(204);
      });

      it('throws an error if the record is not found', async () => {
        const [request, response] = await mockArgs(10000);

        await subject
          .update(request, response)
          .catch(err => {
            expect(err).toEqual(expect.any(Error));
          });
      });

      it('supports sparse field sets', async () => {
        const id = record.getPrimaryKey();

        const newUser = await (async () => {
          const result = await User.create({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: faker.internet.password(8),
          });

          return result.unwrap();
        })();

        const [request, response] = await mockArgs(id, {
          type: 'posts',
          data: {
            relationships: {
              user: {
                data: {
                  id: newUser.getPrimaryKey(),
                  type: 'users',
                },
              },
            },
          },
          fields: {
            users: [
              'id',
              'name',
              'email',
            ],
          },
          include: [
            'user',
          ],
        });

        const [user, comments] = await Promise.all([
          // $FlowIgnore
          record.user,
          // $FlowIgnore
          record.comments,
        ]);

        expect(user).toBeNull();
        expect(comments).toEqual([]);

        assertRecord(await subject.update(request, response), {
          ...getDefaultProps(),
          id,
          user: expect.objectContaining(
            newUser.getAttributes(
              'id',
              'name',
              'email'
            )
          ),
        });

        await newUser.destroy();
      });
    });

    describe('#destroy()', () => {
      let record;

      const mockArgs = async id => {
        const [request, response] = await adapter({
          url: `/posts/${id}`,
          method: 'DELETE',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        });

        Object.assign(request.params, {
          id,
        });

        Object.assign(request.defaultParams, {
          fields: DEFAULT_FIELDS,
        });

        return [request, response];
      };

      beforeAll(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        });
      });

      it('returns the number `204` if the record is destroyed', async () => {
        const [request, response] = await mockArgs(record.getPrimaryKey());

        expect(await subject.destroy(request, response)).toBe(204);
      });

      it('throws an error if the record is not found', async () => {
        const [request, response] = await mockArgs(10000);

        await subject
          .destroy(request, response)
          .catch(err => {
            expect(err).toEqual(expect.any(Error));
          });
      });
    });

    describe('#preflight()', () => {
      const mockArgs = async () => {
        const [request, response] = await adapter({
          url: '/posts',
          method: 'OPTIONS',
          headers: {
            Host: HOST,
          },
          resolve: noop,
        });

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: DEFAULT_FIELDS,
          page: {
            size: 25,
            number: 1,
          },
        });

        return [request, response];
      };

      it('returns the number `204`', async () => {
        const [request, response] = await mockArgs();

        expect(await subject.preflight(request, response)).toBe(204);
      });
    });
  });
});
