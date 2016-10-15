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
                beforeSuccess: true
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
  });
});
