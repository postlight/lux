// @flow
import Route from '../route';
import Router from '../index';
import Logger from '../../logger';
import { request } from '../../adapter/mock';
import type Controller from '../../controller';
import { getTestApp } from '../../../../test/utils/get-test-app';

const CONTROLLER_MISSING_MESSAGE = /Could not resolve controller by name '.+'/;

describe('module "router"', () => {
  describe('class Router', () => {
    let controller: Controller;
    let controllers;

    beforeAll(async () => {
      const app = await getTestApp();

      controllers = app.controllers;
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

        expect(subject.has('GET:/users')).toBe(true);
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

        expect(subject.has('GET:/posts')).toBe(true);
        expect(subject.has('GET:/posts/:dynamic')).toBe(true);
        expect(subject.has('POST:/posts')).toBe(true);
        expect(subject.has('PATCH:/posts/:dynamic')).toBe(true);
        expect(subject.has('DELETE:/posts/:dynamic')).toBe(true);
        expect(subject.has('HEAD:/posts')).toBe(true);
        expect(subject.has('HEAD:/posts/:dynamic')).toBe(true);
        expect(subject.has('OPTIONS:/posts')).toBe(true);
        expect(subject.has('OPTIONS:/posts/:dynamic')).toBe(true);
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
        }).toThrow();
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

        expect(subject.has('GET:/admin/posts')).toBe(true);
        expect(subject.has('GET:/admin/posts/:dynamic')).toBe(true);
        expect(subject.has('POST:/admin/posts')).toBe(true);
        expect(subject.has('PATCH:/admin/posts/:dynamic')).toBe(true);
        expect(subject.has('DELETE:/admin/posts/:dynamic')).toBe(true);
        expect(subject.has('HEAD:/admin/posts')).toBe(true);
        expect(subject.has('HEAD:/admin/posts/:dynamic')).toBe(true);
        expect(subject.has('OPTIONS:/admin/posts')).toBe(true);
        expect(subject.has('OPTIONS:/admin/posts/:dynamic')).toBe(true);
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
        }).toThrow();
      });
    });

    describe('#match()', () => {
      let logger;
      let subject;

      beforeAll(() => {
        logger = new Logger({
          level: 'ERROR',
          format: 'text',
          filter: {
            params: [],
          },
          enabled: false,
        });

        subject = new Router({
          controller,
          controllers,

          routes() {
            this.resource('posts');
          }
        });
      });

      it('can match a route for a request with a dynamic url', () => {
        expect(
          subject.match(
            request.create({
              logger,
              url: '/posts/1',
              params: {
                id: 1,
              },
              method: 'GET',
              headers: new Map(),
              encrypted: false,
              defaultParams: {},
            })
          )
        ).toBeInstanceOf(Route);
      });

      it('can match a route for a request with a non-dynamic url', () => {
        expect(
          subject.match(
            request.create({
              logger,
              url: '/posts',
              params: {},
              method: 'GET',
              headers: new Map(),
              encrypted: false,
              defaultParams: {},
            })
          )
        ).toBeInstanceOf(Route);
      });
    });
  });
});
