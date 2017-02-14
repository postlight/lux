// @flow
import faker from 'faker';

import { MIME_TYPE } from '../../jsonapi';
import Controller from '../index';
import Serializer from '../../serializer';
import { Model } from '../../database';
import * as Adapters from '../../adapter';
import K from '../../../utils/k';
import type { Request } from '../../request';
import type { Response } from '../../response';

import { getTestApp } from '../../../../test/utils/get-test-app';

const HOST = 'localhost:4000';

describe('module "controller"', () => {
  describe('class Controller', () => {
    let Post: Class<Model>;
    let subject: Controller;
    let adapter;

    const attributes = [
      'id',
      'body',
      'title',
      'isPublic',
      'createdAt',
      'updatedAt'
    ];

    const assertRecord = (item, keys = attributes) => {
      expect(item).toBeInstanceOf(Post);
      if (item instanceof Post) {
        expect(Object.keys(item.rawColumnData)).toEqual(keys);;
      }
    };

    beforeAll(async () => {
      const app = await getTestApp();
      const model = app.models.get('post');

      if (model) {
        Post = model;
      }

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
          url: '/posts' + query,
          method: 'GET',
          headers: {
            Host: HOST,
          },
          resolve: K,
        });

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: {
            posts: attributes,
          },
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
          assertRecord(item);
          expect(item.isPublic).toBe(false);
        });
      });

      it('supports sparse field sets', async () => {
        const [request, response] = await mockArgs('?fields[posts]=id,title');
        const result = await subject.index(request, response);

        expect(result).toBeInstanceOf(Array);
      });

      it('supports eager loading relationships', async () => {
        const [request, response] = await mockArgs('?include=user');
        const result = await subject.index(request, response);

        expect(result).toBeInstanceOf(Array);
        result.forEach(item => {
          if (item.rawColumnData.user) {
            assertRecord(item, [
              ...attributes,
              'user'
            ]);

            expect(Object.keys(item.rawColumnData.user)).toEqual([
              'id',
              'name',
              'email'
            ]);
          }
        });
      });
    });

    describe('#show()', () => {
      const mockArgs = async (id, query = '') => {
        const [request, response] = await adapter({
          url: `/posts/${id}` + query,
          method: 'GET',
          headers: {
            Host: HOST,
          },
          resolve: K,
        });

        request.params = { id, ...request.params };

        Object.assign(request.defaultParams, {
          fields: {
            posts: attributes,
          },
        });

        return [request, response];
      };

      it('returns a single record', async () => {
        const [request, response] = await mockArgs(1);
        const result = await subject.show(request, response);

        expect(result).toBeTruthy();

        if (result) {
          assertRecord(result);
        }
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
        const [
          request,
          response,
        ] = await mockArgs(1, '?fields[posts]=id,title');
        const result = await subject.show(request, response);

        expect(result).toBeTruthy();
        assertRecord(result, ['id', 'title']);
      });

      it('supports eager loading relationships', async () => {
        const [
          request,
          response,
        ] = await mockArgs(1, '?include=user&fields[users]=id,name,email');
        const result = await subject.show(request, response);

        expect(result).toBeTruthy();

        if (result) {
          assertRecord(result, [
            ...attributes,
            'user'
          ]);

          expect(Object.keys(result.rawColumnData.user)).toEqual([
            'id',
            'name',
            'email'
          ]);
        }
      });
    });

    describe('#create()', () => {
      let result: Model;

      const mockArgs = async params => {
        const [request, response] = await adapter({
          url: '/posts',
          method: 'POST',
          headers: {
            Host: HOST,
            'Content-Type': MIME_TYPE,
          },
          resolve: K,
        });

        request.params = {
          ...request.params,
          ...params,
        };

        Object.assign(request.defaultParams, {
          fields: {
            posts: attributes,
          },
        });

        return [request, response];
      };

      afterEach(async () => {
        await result.destroy();
      });

      it('returns the newly created record', async () => {
        const [request, response] = await mockArgs({
          include: ['user'],
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test',
              isPublic: true
            },
            relationships: {
              user: {
                data: {
                  id: 1,
                  type: 'posts'
                }
              }
            }
          },
          fields: {
            users: ['id']
          }
        });

        result = await subject.create(request, response);

        assertRecord(result, [
          'id',
          'user',
          'title',
          'isPublic',
          'createdAt',
          'updatedAt'
        ]);

        const user = await Reflect.get(result, 'user');
        const title = Reflect.get(result, 'title');
        const isPublic = Reflect.get(result, 'isPublic');

        expect(user.id).toBe(1);
        expect(title).toBe('#create() Test');
        expect(isPublic).toBe(true);
      });

      it('sets `response.statusCode` to the number `201`', async () => {
        const [request, response] = await mockArgs({
          include: ['user'],
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test'
            }
          },
          fields: {
            users: ['id']
          }
        });

        result = await subject.create(request, response);

        expect(response.statusCode).toBe(201);
      });

      it('sets the correct `Location` header', async () => {
        const [request, response] = await mockArgs({
          include: ['user'],
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test'
            }
          },
          fields: {
            users: ['id']
          }
        });

        result = await subject.create(request, response);

        const id = Reflect.get(result, 'id');
        const location = response.headers.get('location');

        expect(location).toBe(`http://${HOST}/posts/${id}`);
      });
    });

    describe('#update()', () => {
      let User;
      let record;

      const mockArgs = async (id, params) => {
        const [request, response] = await adapter({
          url: `/posts/${id}`,
          method: 'PATCH',
          headers: {
            Host: HOST,
            'Content-Type': MIME_TYPE,
          },
          resolve: K,
        });

        request.params = { id, ...request.params };

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: {
            posts: attributes,
          },
          page: {
            size: 25,
            number: 1,
          },
        });

        return [request, response];
      };

      beforeEach(async () => {
        const { models } = await getTestApp();
        const userModel = models.get('user');

        if (!userModel) {
          throw new Error('Could not find model "user".');
        }

        User = userModel;

        return Post
          .create({
            title: '#update() Test'
          })
          .then(post => post.unwrap())
          .then(post => {
            record = post;
          });
      });

      afterEach(() => record.destroy());

      it('returns a record if attribute(s) change', async () => {
        const id = record.getPrimaryKey();
        const [request, response] = await mockArgs(id, {
          type: 'posts',
          data: {
            attributes: {
              isPublic: true
            }
          }
        });

        expect(record.rawColumnData.isPublic).toBe(false);

        return subject
          .update(request, response)
          .then(result => {
            assertRecord(result);
            return Post.find(id);
          })
          .then(({ rawColumnData: { isPublic } }) => {
            expect(isPublic).toBe(true);
          });
      });

      it('returns a record if relationships(s) change', async () => {
        let item = record;
        let user = await Reflect.get(item, 'user');
        let comments = await Reflect.get(item, 'comments');
        const id = item.getPrimaryKey();

        expect(user).toBeNull();
        expect(comments).toEqual([]);

        const newUser = await User
          .create({
            name: `${faker.name.firstName()} ${faker.name.lastName()}`,
            email: faker.internet.email(),
            password: faker.internet.password(8)
          })
          .then(res => res.unwrap());

        const [request, response] = await mockArgs(id, {
          type: 'posts',
          include: ['user'],
          data: {
            relationships: {
              user: {
                data: {
                  id: newUser.getPrimaryKey(),
                  type: 'users'
                }
              },
              comments: {
                data: [
                  {
                    id: 1,
                    type: 'comments'
                  },
                  {
                    id: 2,
                    type: 'comments'
                  },
                  {
                    id: 3,
                    type: 'comments'
                  }
                ]
              }
            }
          },
          fields: {
            users: ['id'],
            comments: ['id']
          }
        });

        const result = await subject.update(request, response);

        assertRecord(result, [
          ...attributes,
          'user',
          'comments'
        ]);

        // $FlowIgnore
        item = await item.reload().include('user', 'comments');
        ({ rawColumnData: { user, comments } } = item);

        expect(user.id).toBe(newUser.getPrimaryKey());
        expect(comments).toEqual(expect.any(Array));
        expect(comments).toHaveLength(3);
      });

      it('returns the number `204` if no changes occur', async () => {
        const [request, response] = await mockArgs(record.getPrimaryKey(), {
          type: 'posts',
          data: {
            attributes: {
              title: '#update() Test'
            }
          }
        });

        expect(await subject.update(request, response)).toBe(204);
      });

      it('throws an error if the record is not found', async () => {
        const [request, response] = await mockArgs(10000, {
          type: 'posts',
          data: {
            attributes: {
              isPublic: true
            }
          }
        });

        await subject
          .update(request, response)
          .catch(err => {
            expect(err).toBeInstanceOf(Error);
          });
      });

      it('supports sparse field sets', async () => {
        const [request, response] = await mockArgs(record.getPrimaryKey(), {
          type: 'posts',
          data: {
            attributes: {
              title: 'Sparse Field Sets Work With #update()!',
            },
          },
          fields: {
            posts: [
              'id',
              'title',
            ],
          }
        });

        expect(record).toEqual(
          expect.objectContaining({
            rawColumnData: expect.objectContaining({
              title: '#update() Test'
            })
          })
        );

        assertRecord(await subject.update(request, response), [
          'id',
          'title'
        ]);

        expect(await record.reload()).toEqual(
          expect.objectContaining({
            rawColumnData: expect.objectContaining({
              title: 'Sparse Field Sets Work With #update()!'
            })
          })
        );
      });
    });

    describe('#destroy()', () => {
      let record: Model;

      const mockArgs = async id => {
        const [request, response] = await adapter({
          url: `/posts/${id}`,
          method: 'DELETE',
          headers: {
            Host: HOST,
          },
          resolve: K,
        });

        Object.assign(request.params, {
          id,
        });

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: {
            posts: attributes,
          },
          page: {
            size: 25,
            number: 1,
          },
        });

        return [request, response];
      };

      beforeAll(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        });
      });

      it('returns the number `204` if the record is destroyed', async () => {
        const id = record.getPrimaryKey();
        const [request, response] = await mockArgs(id);
        const result = await subject.destroy(request, response);

        expect(result).toBe(204);

        await Post
          .find(id)
          .catch(err => {
            expect(err).toBeInstanceOf(Error);
          });
      });

      it('throws an error if the record is not found', async () => {
        const [request, response] = await mockArgs(10000);

        await subject
          .destroy(request, response)
          .catch(err => {
            expect(err).toBeInstanceOf(Error);
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
          resolve: K,
        });

        Object.assign(request.defaultParams, {
          sort: 'createdAt',
          filter: {},
          fields: {
            posts: attributes,
          },
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
