// @flow
import Controller from '../../../controller';
import * as Adapters from '../../../adapter';
import type { Request } from '../../../request';
import K from '../../../../utils/k';
import { getTestApp } from '../../../../../test/utils/get-test-app';

import Route from '../index';

describe('module "router/route"', () => {
  describe('class Route', () => {
    let adapter;

    beforeAll(async () => {
      const app = await getTestApp();

      adapter = Adapters.mock(app);
    });

    describe('#constructor()', () => {
      let controller: Controller;

      beforeAll(async () => {
        const { controllers } = await getTestApp();

        controller = controllers.get('posts');
      });

      it('creates an instance of route', () => {
        const result = new Route({
          controller,
          type: 'collection',
          path: 'posts',
          action: 'index',
          method: 'GET'
        });

        expect(result).toBeInstanceOf(Route);
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
        }).toThrow();
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
        }).toThrow();
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
        }).toThrow();
      });
    });

    describe('#parseParams()', () => {
      let staticRoute: Route;
      let dynamicRoute: Route;
      let dataRoute: Route;

      beforeAll(async () => {
        const { controllers } = await getTestApp();
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
        expect(staticRoute.parseParams(['1'])).toEqual({});
      });

      it('contains params matching dynamic segments', () => {
        expect(dynamicRoute.parseParams(['1'])).toEqual({ id: 1 });
      });

      it('does not contain params for unmatched dynamic segments', () => {
        expect(dynamicRoute.parseParams(['1', '2'])).toEqual({ id: 1 });
      });
    });

    describe('#execHandlers()', () => {
      let subject: Route;

      const mockArgs = () => (
        adapter({
          url: '/tests',
          method: 'GET',
          headers: {},
          resolve: K,
        })
      );

      describe('- with action only', () => {
        beforeAll(async () => {
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
        });

        it('resolves with the correct data', async () => {
          const [request, response] = await mockArgs();
          const result = await subject.execHandlers(request, response);

          expect(result).toMatchSnapshot();
        });
      });

      describe('- with `beforeAction`', () => {
        beforeAll(async () => {
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
        });

        it('resolves with the correct data', async () => {
          const [request, response] = await mockArgs();
          const result = await subject.execHandlers(request, response);

          expect(result).toMatchSnapshot();
        });
      });

      describe('- with `afterAction`', () => {
        beforeAll(async () => {
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
        });

        it('resolves with the correct data', async () => {
          const [request, response] = await mockArgs();
          const result = await subject.execHandlers(request, response);

          expect(result).toMatchSnapshot();
        });
      });

      describe('- with `beforeAction` and `afterAction`', () => {
        let beforeAction;

        beforeAll(async () => {
          beforeAction = jest.fn();

          class TestController extends Controller {
            beforeAction = [beforeAction];

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
        });

        afterEach(() => {
          beforeAction.mockReset();
        });

        it('resolves with the correct data', async () => {
          const [request, response] = await mockArgs();
          const result = await subject.execHandlers(request, response);

          expect(result).toMatchSnapshot();
          expect(beforeAction).toBeCalledWith(request, response, undefined);
        });
      });
    });

    describe('#visit', () => {
      let controller: Controller;

      beforeAll(async () => {
        const { controllers } = await getTestApp();

        controller = await controllers.get('posts');
      });

      ['GET', 'OPTIONS'].forEach(method => {
        describe(`- method "${method}"`, () => {
          let subject;

          const mockArgs = async (params = {}) => {
            const [request, response] = await adapter({
              method,
              url: '/posts',
              headers: {},
              resolve: K,
            });

            Object.assign(request.params, params);

            return [request, response];
          };

          beforeAll(() => {
            subject = new Route({
              method,
              controller,
              type: 'collection',
              path: 'posts',
              action: 'preflight'
            });
          });

          describe('- with params', () => {
            it('works', async () => {
              const [request, response] = await mockArgs({
                filter: {
                  title: 'New Post',
                },
              });

              const result = await subject.visit(request, response);

              expect(result).toMatchSnapshot();
            });
          });

          describe('- without params', () => {
            it('works', async () => {
              const [request, response] = await mockArgs();
              const result = await subject.visit(request, response);

              expect(result).toMatchSnapshot();
            });
          });
        });
      });
    });
  });
});
