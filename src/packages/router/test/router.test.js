// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import Route from '../route';
import Router from '../index';
import type Controller from '../../controller';

import { getTestApp } from '../../../../test/utils/get-test-app';

import type { Request } from '../../server';

const CONTROLLER_MISSING_MESSAGE = /Could not resolve controller by name '.+'/;

describe('module "router"', () => {
  describe('class Router', () => {
    let controller: Controller<*>;
    let controllers;

    before(async () => {
      const app = await getTestApp();

      controllers = app.controllers;

      // $FlowIgnore
      controller = controllers.get('application');
    });

    describe('- defining a single route', () => {
      it('works as expected', () => {
        const subject = new Router({
          controller,
          controllers,

          routes() {
            this.resource('users', {
              only: ['index']
            });
          }
        });

        expect(subject.has('GET:/users')).to.be.true;
      });
    });

    describe('- defining a complete resource', () => {
      it('works as expected', () => {
        const subject = new Router({
          controller,
          controllers,

          routes() {
            this.resource('posts');
          }
        });

        expect(subject.has('GET:/posts')).to.be.true;
        expect(subject.has('GET:/posts/:dynamic')).to.be.true;
        expect(subject.has('POST:/posts')).to.be.true;
        expect(subject.has('PATCH:/posts/:dynamic')).to.be.true;
        expect(subject.has('DELETE:/posts/:dynamic')).to.be.true;
        expect(subject.has('HEAD:/posts')).to.be.true;
        expect(subject.has('HEAD:/posts/:dynamic')).to.be.true;
        expect(subject.has('OPTIONS:/posts')).to.be.true;
        expect(subject.has('OPTIONS:/posts/:dynamic')).to.be.true;
      });

      it('throws an error when a controller is missing', () => {
        expect(() => {
          new Router({
            controller,
            controllers,

            routes() {
              this.resource('articles');
            }
          });
        }).to.throw(ReferenceError, CONTROLLER_MISSING_MESSAGE);
      });
    });

    describe('- defining a complete namespace', () => {
      it('works as expected', () => {
        const subject = new Router({
          controller,
          controllers,

          routes() {
            this.namespace('admin', function () {
              this.resource('posts');
            });
          }
        });

        expect(subject.has('GET:/admin/posts')).to.be.true;
        expect(subject.has('GET:/admin/posts/:dynamic')).to.be.true;
        expect(subject.has('POST:/admin/posts')).to.be.true;
        expect(subject.has('PATCH:/admin/posts/:dynamic')).to.be.true;
        expect(subject.has('DELETE:/admin/posts/:dynamic')).to.be.true;
        expect(subject.has('HEAD:/admin/posts')).to.be.true;
        expect(subject.has('HEAD:/admin/posts/:dynamic')).to.be.true;
        expect(subject.has('OPTIONS:/admin/posts')).to.be.true;
        expect(subject.has('OPTIONS:/admin/posts/:dynamic')).to.be.true;
      });

      it('throws an error when a controller is missing', () => {
        expect(() => {
          new Router({
            controller,
            controllers,

            routes() {
              this.namespace('v1', function () {
                this.resource('posts');
              });
            }
          });
        }).to.throw(ReferenceError, CONTROLLER_MISSING_MESSAGE);
      });
    });

    describe('#match()', () => {
      let subject: Router;

      before(() => {
        subject = new Router({
          controller,
          controllers,

          routes() {
            this.resource('posts');
          }
        });
      });

      it('can match a route for a request with a dynamic url', () => {
        // $FlowIgnore
        const req: Request = {
          method: 'GET',
          url: {
            pathname: '/posts/1'
          }
        };

        expect(subject.match(req)).to.be.an.instanceof(Route);
      });

      it('can match a route for a request with a non-dynamic url', () => {
        // $FlowIgnore
        const req: Request = {
          method: 'GET',
          url: {
            pathname: '/posts'
          }
        };

        expect(subject.match(req)).to.be.an.instanceof(Route);
      });
    });
  });
});
