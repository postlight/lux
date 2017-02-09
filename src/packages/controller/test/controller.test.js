// @flow
import faker from 'faker';
import { expect } from 'chai';
import { it, describe, before, beforeEach, afterEach } from 'mocha';

import Controller from '../index';
import Serializer from '../../serializer';
import { Model } from '../../database';

import { getTestApp } from '../../../../test/utils/get-test-app';
import { createResponse } from '../../../../test/utils/mocks';

import type { Request, Response } from '../../server';

const HOST = 'localhost:4000';

describe('module "controller"', () => {
  describe('class Controller', () => {
    let Post: Class<Model>;
    let subject: Controller<*>;

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
      // $FlowIgnore
      const createRequest = (params = {}): Request => ({
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
      });

      it('returns an array of records', () => {
        return subject
          .index(createRequest())
          .then(result => {
            expect(result).to.be.an('array').with.lengthOf(25);
            result.forEach(item => assertRecord(item));
          });
      });

      it('supports specifying page size', () => {
        const request = createRequest({
          page: {
            size: 10
          }
        });

        return subject
          .index(request)
          .then(result => {
            expect(result).to.be.an('array').with.lengthOf(10);
            result.forEach(item => assertRecord(item));
          });
      });

      it('supports filter parameters', () => {
        const request = createRequest({
          filter: {
            isPublic: false
          }
        });

        return subject
          .index(request)
          .then(result => {
            expect(result).to.be.an('array').with.length.above(0);

            result.forEach(item => {
              assertRecord(item);
              expect(item).to.have.property('isPublic', false);
            });
          });
      });

      it('supports sparse field sets', () => {
        const request = createRequest({
          fields: {
            posts: ['id', 'title']
          }
        });

        return subject
          .index(request)
          .then(result => {
            expect(result).to.be.an('array').with.lengthOf(25);
            result.forEach(item => assertRecord(item, ['id', 'title']));
          });
      });

      it('supports eager loading relationships', () => {
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

        return subject
          .index(request)
          .then(result => {
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
    });

    describe('#show()', () => {
      // $FlowIgnore
      const createRequest = (params = {}): Request => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      });

      it('returns a single record', async () => {
        const request = createRequest({ id: 1 });
        const result = await subject.show(request);

        expect(result).to.be.ok;

        if (result) {
          assertRecord(result);
        }
      });

      it('throws an error if the record is not found', async () => {
        const request = createRequest({ id: 10000 });

        await subject.show(request).catch(err => {
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

      it('supports eager loading relationships', () => {
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

        return subject
          .show(request)
          .then(result => {
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
    });

    describe('#create()', () => {
      let result: Model;

      // $FlowIgnore
      const createRequest = (params = {}): Request => ({
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
      });

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

        const user = await result.user;
        const title = result.title;
        const isPublic = result.isPublic;

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

        const id = result.getPrimaryKey();
        const location = response.getHeader('Location');

        expect(location).to.equal(`http://${HOST}/posts/${id}`);
      });
    });

    describe('#update()', () => {
      let User: Class<Model>;
      let record: Model;

      // $FlowIgnore
      const createRequest = (params = {}): Request => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      });

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

      afterEach(async () => {
        await record.destroy();
      });

      it('returns a record if attribute(s) change', async () => {
        let item = record;
        // $FlowIgnore
        let isPublic = item.isPublic;
        // $FlowIgnore
        const id = item.id;

        expect(item).to.have.property('isPublic', false);

        const request = createRequest({
          id,
          type: 'posts',
          data: {
            attributes: {
              isPublic: true
            }
          }
        });

        assertRecord(await subject.update(request));
        expect(await Post.find(id)).to.have.property('isPublic', true);
      });

      it('returns a record if relationships(s) change', async () => {
        let item = record;
        // $FlowIgnore
        let user = await item.user;
        // $FlowIgnore
        let comments = await item.comments;
        const id = item.getPrimaryKey();

        expect(user).to.be.null;
        expect(comments).to.deep.equal([]);

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

        expect(user).to.have.property('id', newUser.getPrimaryKey());

        expect(comments)
          .to.be.an('array')
          .with.lengthOf(3);
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

        expect(await subject.update(request)).to.equal(204);
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
          expect(err).to.be.an.instanceof(Error);
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

        expect(record).to.have.deep.property(
          'rawColumnData.title',
          '#update() Test'
        );

        assertRecord(await subject.update(request), [
          'id',
          'title'
        ]);

        expect(await record.reload()).to.have.deep.property(
          'rawColumnData.title',
          'Sparse Field Sets Work With #update()!'
        );
      });
    });

    describe('#destroy()', () => {
      let record: Model;

      // $FlowIgnore
      const createRequest = (params = {}): Request => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      });

      before(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        });
      });

      it('returns the number `204` if the record is destroyed', async () => {
        const id = record.getPrimaryKey();
        const result = await subject.destroy(createRequest({ id }));

        expect(result).to.equal(204);

        await Post.find(id).catch(err => {
          expect(err).to.be.an.instanceof(Error);
        });
      });

      it('throws an error if the record is not found', async () => {
        const request = createRequest({ id: 10000 });

        await subject.destroy(request).catch(err => {
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
