// @flow
import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import Controller from '../../../controller';
import type { Request, Response } from '../../../server';
import { getTestApp } from '../../../../../test/utils/get-test-app';
import {
  createResponse,
  createRequestBuilder
} from '../../../../../test/utils/mocks';

import Route from '../index';

describe('module "router/route"', () => {
  describe('class Route', () => {
    describe('#constructor()', () => {
      let controller: Controller<*>;

      before(async () => {
        const { controllers } = await getTestApp();
        const postsController = controllers.get('posts');

        if (!postsController) {
          throw new Error('Could not find controller "posts".');
        }

        controller = postsController;
      });

      it('creates an instance of route', () => {
        const result = new Route({
          controller,
          type: 'collection',
          path: 'posts',
          action: 'index',
          method: 'GET'
        });

        expect(result).to.be.an.instanceOf(Route);
      });

      it('throws when a handler is not found', () => {
        expect(() => {
          new Route({
            controller,
            type: 'collection',
            path: 'posts',
            action: 'invalidHandler',
            method: 'GET'
          });
        }).to.throw(TypeError);
      });

      it('throws when an an action is not provided', () => {
        expect(() => {
          // $FlowIgnore
          new Route({
            controller,
            type: 'collection',
            path: 'posts',
            method: 'GET'
          });
        }).to.throw(TypeError);
      });

      it('throws when an an controller is not provided', () => {
        expect(() => {
          // $FlowIgnore
          new Route({
            type: 'collection',
            path: 'posts',
            action: 'index',
            method: 'GET'
          });
        }).to.throw(TypeError);
      });
    });

    describe('#parseParams()', () => {
      let staticRoute: Route;
      let dynamicRoute: Route;
      let dataRoute: Route;

      before(async () => {
        const { controllers } = await getTestApp();
        // $FlowIgnore
        const controller: Controller = controllers.get('posts');

        staticRoute = new Route({
          controller,
          type: 'collection',
          path: 'posts',
          action: 'index',
          method: 'GET',
        });
        dynamicRoute = new Route({
          controller,
          type: 'member',
          path: 'posts/:id',
          action: 'show',
          method: 'GET',
        });
        dataRoute = new Route({
          controller,
          type: 'member',
          path: 'posts/:id',
          action: 'create',
          method: 'PATCH',
        });
      });

      it('is empty for static paths', () => {
        expect(staticRoute.parseParams(['1'])).to.be.empty;
      });

      it('contains params matching dynamic segments', () => {
        expect(dynamicRoute.parseParams(['1'])).to.deep.equal({ id: 1 });
      });

      it('does not contain params for unmatched dynamic segments', () => {
        expect(dynamicRoute.parseParams(['1', '2'])).to.deep.equal({ id: 1 });
      });
    });

    describe('#execHandlers()', () => {
      let subject: Route;
      let createRequest;

      describe('- with action only', () => {
        before(async () => {
          class TestController extends Controller {
            // $FlowIgnore
            index = async () => ({
              meta: {
                success: true
              }
            });
          }

          subject = new Route({
            type: 'collection',
            path: 'tests',
            action: 'index',
            method: 'GET',
            controller: new TestController({
              namespace: ''
            })
          });

          createRequest = createRequestBuilder({
            path: '/tests',
            route: subject,
            params: {}
          });
        });

        it('resolves with the correct data', async () => {
          const result = await subject.execHandlers(
            createRequest(),
            createResponse()
          );

          expect(result).to.deep.equal({
            meta: {
              success: true
            }
          });
        });
      });

      describe('- with `beforeAction`', () => {
        before(async () => {
          class TestController extends Controller {
            beforeAction = [
              async () => ({
                meta: {
                  beforeSuccess: true
                }
              })
            ];

            // $FlowIgnore
            index = async () => ({
              meta: {
                success: true
              }
            });
          }

          subject = new Route({
            type: 'collection',
            path: 'tests',
            action: 'index',
            method: 'GET',
            controller: new TestController({
              namespace: ''
            })
          });

          createRequest = createRequestBuilder({
            path: '/tests',
            route: subject,
            params: {}
          });
        });

        it('resolves with the correct data', async () => {
          const result = await subject.execHandlers(
            createRequest(),
            createResponse()
          );

          expect(result).to.deep.equal({
            meta: {
              beforeSuccess: true
            }
          });
        });
      });

      describe('- with `afterAction`', () => {
        before(async () => {
          class TestController extends Controller {
            // $FlowIgnore
            index = async () => ({
              meta: {
                success: true,
                afterSuccess: true
              }
            });
          }

          subject = new Route({
            type: 'collection',
            path: 'tests',
            action: 'index',
            method: 'GET',
            controller: new TestController({
              namespace: ''
            })
          });

          createRequest = createRequestBuilder({
            path: '/tests',
            route: subject,
            params: {}
          });
        });

        it('resolves with the correct data', async () => {
          const result = await subject.execHandlers(
            createRequest(),
            createResponse()
          );

          expect(result).to.deep.equal({
            meta: {
              success: true,
              afterSuccess: true
            }
          });
        });
      });

      describe('- with `beforeAction` and `afterAction`', () => {
        let beforeSpy;

        before(async () => {
          const beforeHooks = {
            call: async () => undefined
          };

          beforeSpy = spy(beforeHooks, 'call');

          class TestController extends Controller {
            beforeAction = [
              beforeHooks.call
            ];

            afterAction = [
              async (req, res, { meta }) => ({
                meta: {
                  ...meta,
                  afterSuccess: true
                }
              })
            ];

            // $FlowIgnore
            index = async () => ({
              meta: {
                success: true
              }
            });
          }

          subject = new Route({
            type: 'collection',
            path: 'tests',
            action: 'index',
            method: 'GET',
            controller: new TestController({
              namespace: ''
            })
          });

          createRequest = createRequestBuilder({
            path: '/tests',
            route: subject,
            params: {}
          });
        });

        it('resolves with the correct data', async () => {
          const result = await subject.execHandlers(
            createRequest(),
            createResponse()
          );

          expect(beforeSpy.calledOnce).to.be.true;
          expect(result).to.deep.equal({
            meta: {
              success: true,
              afterSuccess: true
            }
          });
        });
      });
    });

    describe('#visit', () => {
      let controller: Controller<*>;

      before(async () => {
        const { controllers } = await getTestApp();

        // $FlowIgnore
        controller = await controllers.get('posts');
      });

      ['GET', 'OPTIONS'].forEach(method => {
        describe(`- method "${method}"`, () => {
          let subject;
          let createRequest;

          before(async () => {


            subject = new Route({
              method,
              controller,
              type: 'collection',
              path: 'posts',
              action: 'preflight'
            });
          });

          describe('- with params', () => {
            before(() => {
              createRequest = createRequestBuilder({
                method,
                controller,
                path: '/posts',
                route: subject,
                params: {
                  filter: {
                    title: 'New Post'
                  }
                }
              });
            });

            it('works', async () => {
              const result = await subject.visit(
                createRequest(),
                createResponse()
              );

              expect(result).to.be.ok;
            });
          });

          describe('- without params', () => {
            before(() => {
              createRequest = createRequestBuilder({
                method,
                path: '/posts',
                route: subject
              });
            });

            it('works', async () => {
              const result = await subject.visit(
                createRequest(),
                createResponse()
              );

              expect(result).to.be.ok;
            });
          });
        });
      });
    });
  });
});
