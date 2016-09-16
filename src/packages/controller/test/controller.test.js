// @flow
import { expect } from 'chai';
import { it, describe, before, beforeEach, afterEach } from 'mocha';

import Controller from '../index';
import Serializer from '../../serializer';
import { Model } from '../../database';

import K from '../../../utils/k';
import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type { Request, Response } from '../../server';

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
      expect(item).to.be.an.instanceof(Post);

      if (item instanceof Post) {
        expect(item.rawColumnData).to.have.all.keys(keys);
      }
    };

    before(async () => {
      const app = await getTestApp();

      Post = setType(() => app.models.get('post'));

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

        expect(result).to.be.an('array').with.lengthOf(25);
        result.forEach(item => assertRecord(item));
      });

      it('supports specifying page size', async () => {
        const request = createRequest({
          page: {
            size: 10
          }
        });

        const result = await subject.index(request);

        expect(result).to.be.an('array').with.lengthOf(10);
        result.forEach(item => assertRecord(item));
      });

      it('supports filter parameters', async () => {
        const request = createRequest({
          filter: {
            isPublic: false
          }
        });

        const result = await subject.index(request);

        expect(result).to.be.an('array').with.length.above(0);

        result.forEach(item => {
          assertRecord(item);
          expect(Reflect.get(item, 'isPublic')).to.be.false;
        });
      });

      it('supports sparse field sets', async () => {
        const request = createRequest({
          fields: {
            posts: ['id', 'title']
          }
        });

        const result = await subject.index(request);

        expect(result).to.be.an('array').with.lengthOf(25);
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

        expect(result).to.be.an('array').with.lengthOf(25);

        result.forEach(item => {
          assertRecord(item, [
            ...attributes,
            'user'
          ]);

          expect(item.rawColumnData.user).to.have.all.keys([
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

        expect(result).to.be.ok;

        if (result) {
          assertRecord(result);
        }
      });

      it('throws an error if the record is not found', () => {
        const request = createRequest({ d: Number.MAX_SAFE_INTEGER });

        subject.show(request).then(K, err => {
          expect(err).to.be.an.instanceof(Error);
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

        expect(result).to.be.ok;
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

        expect(result).to.be.ok;

        if (result) {
          assertRecord(result, [
            ...attributes,
            'user'
          ]);

          expect(result.rawColumnData.user).to.have.all.keys([
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
          'title',
          'isPublic',
          'createdAt',
          'updatedAt'
        ]);

        const user = await Reflect.get(result, 'user');
        const title = Reflect.get(result, 'title');
        const isPublic = Reflect.get(result, 'isPublic');

        expect(user.id).to.equal(1);
        expect(title).to.equal('#create() Test');
        expect(isPublic).to.equal(true);
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

        expect(response.statusCode).to.equal(201);
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

        expect(location).to.equal(`http://${HOST}/posts/${id}`);
      });
    });

    describe('#update()', () => {
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

      beforeEach(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        });
      });

      afterEach(async () => {
        await record.destroy();
      });

      it('returns a record if attribute(s) change', async () => {
        let item = record;
        let isPublic = Reflect.get(item, 'isPublic');
        const id = Reflect.get(item, 'id');

        expect(isPublic).to.be.false;

        const request = createRequest({
          id,
          type: 'posts',
          data: {
            attributes: {
              isPublic: true
            }
          }
        });

        const result = await subject.update(request);

        assertRecord(result);

        item = await Post.find(id);
        isPublic = Reflect.get(item, 'isPublic');

        expect(isPublic).to.be.true;
      });

      it('returns a record if relationships(s) change', async () => {
        let item = record;
        let user = await Reflect.get(item, 'user');
        const id = Reflect.get(item, 'id');

        expect(user).to.be.null;

        const request = createRequest({
          id,
          type: 'posts',
          include: ['user'],
          data: {
            relationships: {
              user: {
                data: {
                  id: 1,
                  type: 'users'
                }
              }
            }
          },
          fields: {
            users: ['id']
          }
        });

        const result = await subject.update(request);

        assertRecord(result, [
          ...attributes,
          'user'
        ]);

        item = await Post.find(id);
        user = await Reflect.get(item, 'user');

        expect(user.id).to.equal(1);
      });

      it('returns the number `204` if no changes occur', async () => {
        const id = Reflect.get(record, 'id');

        const request = createRequest({
          id,
          type: 'posts',
          data: {
            attributes: {
              title: '#destroy() Test'
            }
          }
        });

        const result = await subject.update(request);

        expect(result).to.equal(204);
      });

      it('throws an error if the record is not found', () => {
        const request = createRequest({
          id: Number.MAX_SAFE_INTEGER,
          type: 'posts',
          data: {
            attributes: {
              isPublic: true
            }
          }
        });

        subject.update(request).then(K, err => {
          expect(err).to.be.an.instanceof(Error);
        });
      });

      it('supports sparse field sets', async () => {
        let item = record;
        let title = Reflect.get(item, 'title');
        const id = Reflect.get(item, 'id');

        expect(title).to.equal('#destroy() Test');

        const request = createRequest({
          id,
          type: 'posts',
          data: {
            attributes: {
              title: 'Sparse Field Sets Work With #destroy()!'
            }
          },
          fields: {
            posts: ['id', 'title']
          }
        });

        const result = await subject.update(request);

        assertRecord(result, ['id', 'title']);

        item = await Post.find(id);
        title = Reflect.get(item, 'title');

        expect(title).to.equal('Sparse Field Sets Work With #destroy()!');
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

      before(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        });
      });

      it('returns the number `204` if the record is destroyed', async () => {
        const id = Reflect.get(record, 'id');
        const result = await subject.destroy(createRequest({ id }));

        expect(result).to.equal(204);

        await Post.find(id).then(K, err => {
          expect(err).to.be.an.instanceof(Error);
        });
      });

      it('throws an error if the record is not found', () => {
        const request = createRequest({ id: Number.MAX_SAFE_INTEGER });

        subject.destroy(request).then(K, err => {
          expect(err).to.be.an.instanceof(Error);
        });
      });
    });

    describe('#preflight()', () => {
      it('returns the number `204`', async () => {
        const result = await subject.preflight();

        expect(result).to.equal(204);
      });
    });
  });
});
