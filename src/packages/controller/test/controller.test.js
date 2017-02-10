// @flow
import faker from 'faker';

import Controller from '../index';
import Serializer from '../../serializer';
import { Model } from '../../database';
import type { Request } from '../../request';
import type { Response } from '../../response';

import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

const HOST = 'localhost:4000';

describe('module "controller"', () => {
  describe('class Controller', () => {
    let Post: Class<Model>;
    let subject: Controller;

    const attributes = [
      'id',
      'body',
      'title',
      'isPublic',
      'createdAt',
      'updatedAt'
    ];

    const assertRecord = (item, keys = attributes) => {
      expect(item instanceof Post).toBe(true);
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
      const createRequest = (params = {}): Request => setType(() => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          sort: 'createdAt',
          filter: {},
          fields: {
            posts: attributes
          },
          page: {
            size: 25,
            number: 1
          }
        }
      }));

      it('returns an array of records', async () => {
        const request = createRequest();
        const result = await subject.index(request);

        expect(result).toBe(expect.any(Array));
        expect(result).toHaveLength(25);
        result.forEach(item => assertRecord(item));
      });

      it('supports specifying page size', async () => {
        const request = createRequest({
          page: {
            size: 10
          }
        });

        const result = await subject.index(request);

        expect(result).toBe(expect.any(Array));
        expect(result).toHaveLength(10);
        result.forEach(item => assertRecord(item));
      });

      it('supports filter parameters', async () => {
        const result = await subject.index(
          createRequest({
            filter: {
              isPublic: false
            }
          })
        );

        expect(result).toBe(expect.any(Array));

        result.forEach(item => {
          assertRecord(item);
          expect(item.rawColumnData.isPublic).toBe(false);
        });
      });

      it('supports sparse field sets', async () => {
        const request = createRequest({
          fields: {
            posts: ['id', 'title']
          }
        });

        const result = await subject.index(request);

        expect(result).toBe(expect.any(Array));
        expect(result).toHaveLength(25);
        result.forEach(item => assertRecord(item, ['id', 'title']));
      });

      it('supports eager loading relationships', async () => {
        const request = createRequest({
          include: ['user'],
          fields: {
            users: [
              'id',
              'name',
              'email'
            ]
          }
        });

        const result = await subject.index(request);

        expect(result).toBe(expect.any(Array));
        expect(result).toHaveLength(25);
        result.forEach(item => {
          assertRecord(item, [
            ...attributes,
            'user'
          ]);

          expect(item.rawColumnData.user).toEqual([
            'id',
            'name',
            'email'
          ]);
        });
      });
    });

    describe('#show()', () => {
      const createRequest = (params = {}): Request => setType(() => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      }));

      it('returns a single record', async () => {
        const request = createRequest({ id: 1 });
        const result = await subject.show(request);

        expect(result).not.toThrow();

        if (result) {
          assertRecord(result);
        }
      });

      it('throws an error if the record is not found', async () => {
        const request = createRequest({ id: 10000 });

        await subject.show(request).catch(err => {
          expect(err instanceof Error).toBe(true);
        });
      });

      it('supports sparse field sets', async () => {
        const request = createRequest({
          id: 1,
          fields: {
            posts: ['id', 'title']
          }
        });

        const result = await subject.show(request);

        expect(result).not.toThrow();
        assertRecord(result, ['id', 'title']);
      });

      it('supports eager loading relationships', async () => {
        const request = createRequest({
          id: 1,
          include: ['user'],
          fields: {
            users: [
              'id',
              'name',
              'email'
            ]
          }
        });

        const result = await subject.show(request);

        expect(result).not.toThrow();

        if (result) {
          assertRecord(result, [
            ...attributes,
            'user'
          ]);

          expect(result.rawColumnData.user).toEqual([
            'id',
            'name',
            'email'
          ]);
        }
      });
    });

    describe('#create()', () => {
      let result: Model;

      const createRequest = (params = {}): Request => setType(() => ({
        params,
        url: {
          pathname: '/posts'
        },
        route: {
          controller: subject
        },
        headers: new Map([
          ['host', HOST]
        ]),
        connection: {
          encrypted: false
        },
        defaultParams: {
          fields: {
            posts: attributes,
            users: ['id']
          }
        }
      }));

      const createResponse = (): Response => setType(() => ({
        headers: new Map(),
        statusCode: 200,

        setHeader(key: string, value: string): void {
          this.headers.set(key, value);
        },

        getHeader(key: string): string | void {
          return this.headers.get(key);
        }
      }));

      afterEach(async () => {
        await result.destroy();
      });

      it('returns the newly created record', async () => {
        const response = createResponse();

        const request = createRequest({
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
        const response = createResponse();

        const request = createRequest({
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test'
            }
          }
        });

        result = await subject.create(request, response);

        expect(response.statusCode).toBe(201);
      });

      it('sets the correct `Location` header', async () => {
        const response = createResponse();

        const request = createRequest({
          data: {
            type: 'posts',
            attributes: {
              title: '#create() Test'
            }
          }
        });

        result = await subject.create(request, response);

        const id = Reflect.get(result, 'id');
        const location = response.getHeader('Location');

        expect(location).toBe(`http://${HOST}/posts/${id}`);
      });
    });

    describe('#update()', () => {
      let User;
      let record;

      const createRequest = (params = {}): Request => setType(() => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      }));

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

      it('returns a record if attribute(s) change', () => {
        const id = record.getPrimaryKey();
        const request = createRequest({
          id,
          type: 'posts',
          data: {
            attributes: {
              isPublic: true
            }
          }
        });

        expect(record.rawColumnData.isPublic).toBe(false);

        return subject
          .update(request)
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

        const request = createRequest({
          id,
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

        const result = await subject.update(request);

        assertRecord(result, [
          ...attributes,
          'user',
          'comments'
        ]);

        // $FlowIgnore
        item = await item.reload().include('user', 'comments');
        ({ rawColumnData: { user, comments } } = item);

        expect(user.id).toBe(newUser.getPrimaryKey());
        expect(comments).toBe(expect.any(Array));
        expect(comments).toHaveLength(3);
      });

      it('returns the number `204` if no changes occur', async () => {
        const request = createRequest({
          id: record.getPrimaryKey(),
          type: 'posts',
          data: {
            attributes: {
              title: '#update() Test'
            }
          }
        });

        expect(await subject.update(request)).toBe(204);
      });

      it('throws an error if the record is not found', async () => {
        const request = createRequest({
          id: 10000,
          type: 'posts',
          data: {
            attributes: {
              isPublic: true
            }
          }
        });

        await subject.update(request).catch(err => {
          expect(err instanceof Error).toBe(true);
        });
      });

      it('supports sparse field sets', async () => {
        const request = createRequest({
          id: record.getPrimaryKey(),
          type: 'posts',
          data: {
            attributes: {
              title: 'Sparse Field Sets Work With #update()!'
            }
          },
          fields: {
            posts: [
              'id',
              'title'
            ]
          }
        });

        expect(record).toEqual(
          expect.objectContaining({
            rawColumnData: expect.objectContaining({
              title: '#update() Test'
            })
          })
        );

        assertRecord(await subject.update(request), [
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
      const createRequest = (params = {}): Request => setType(() => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      }));

      beforeAll(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        });
      });

      it('returns the number `204` if the record is destroyed', async () => {
        const id = Reflect.get(record, 'id');
        const result = await subject.destroy(createRequest({ id }));

        expect(result).toBe(204);

        await Post.find(id).catch(err => {
          expect(err instanceof Error).toBe(true);
        });
      });

      it('throws an error if the record is not found', async () => {
        const request = createRequest({ id: 10000 });

        await subject.destroy(request).catch(err => {
          expect(err instanceof Error).toBe(true);
        });
      });
    });

    describe('#preflight()', () => {
      it('returns the number `204`', async () => {
        const result = await subject.preflight();

        expect(result).toBe(204);
      });
    });
  });
});
