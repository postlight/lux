// @flow
import Logger from '../../../../logger';
import { request, response } from '../../../../adapter/mock';
import K from '../../../../../utils/k';
import merge from '../../../../../utils/merge';
import { getTestApp } from '../../../../../../test/utils/get-test-app';
import resource from '../enhancers/resource';
import type { Action } from '../../../index';
import type Controller from '../../../../controller';

const DOMAIN = 'localhost:4000';

const logger = new Logger({
  level: 'ERROR',
  format: 'text',
  filter: {
    params: [],
  },
  enabled: false,
});

describe('module "router/route/action"', () => {
  describe('enhancer resource()', () => {
    describe('- type "collection"', () => {
      let subject: Action<any>;

      beforeAll(async () => {
        const { router, controllers } = await getTestApp();
        const controller: Controller = controllers.get('posts');

        subject = resource(controller.index.bind(controller), controller);
      });

      it('returns an enhanced action', () => {
        expect(subject).toEqual(expect.any(Function));
        expect(subject).toHaveLength(2);
      });

      it('resolves with a serialized payload', async () => {
        const result = await subject(
          request.create({
            logger,
            url: '/posts',
            params: {},
            method: 'GET',
            headers: new Map([
              ['host', DOMAIN],
            ]),
            encrypted: false,
            defaultParams: {
              sort: 'createdAt',
              filter: {},
              page: {
                size: 25,
                number: 1,
              },
              fields: {
                posts: [
                  'body',
                  'title',
                  'createdAt',
                  'updatedAt',
                ],
              },
            },
          }),
          response.create({
            logger,
            resolve: K,
          })
        );

        expect(result).toMatchSnapshot();
      });
    });

    describe('- type "member"', () => {
      describe('- with "root" namespace', () => {
        let subject: Action<any>;

        beforeAll(async () => {
          const { router, controllers } = await getTestApp();
          const controller: Controller = controllers.get('posts');

          subject = resource(controller.show.bind(controller), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toEqual(expect.any(Function));
          expect(subject).toHaveLength(2);
        });

        it('resolves with a serialized payload', async () => {
          const result = await subject(
            request.create({
              logger,
              url: '/posts/1',
              params: {
                id: 1,
              },
              method: 'GET',
              headers: new Map([
                ['host', DOMAIN],
              ]),
              encrypted: false,
              defaultParams: {
                fields: {
                  posts: [
                    'body',
                    'title',
                    'createdAt',
                    'updatedAt',
                  ],
                },
              },
            }),
            response.create({
              logger,
              resolve: K,
            })
          );

          expect(result).toMatchSnapshot();
        });
      });

      describe('- with "admin" namespace', () => {
        let subject: Action<any>;

        beforeAll(async () => {
          const { router, controllers } = await getTestApp();
          const controller: Controller = controllers.get('admin/posts');

          subject = resource(controller.show.bind(controller), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toEqual(expect.any(Function));
          expect(subject).toHaveLength(2);
        });

        it('resolves with a serialized payload', async () => {
          const result = await subject(
            request.create({
              logger,
              url: '/admin/posts/1',
              params: {
                id: 1,
              },
              method: 'GET',
              headers: new Map([
                ['host', DOMAIN],
              ]),
              encrypted: false,
              defaultParams: {
                fields: {
                  posts: [
                    'body',
                    'title',
                    'createdAt',
                    'updatedAt',
                  ],
                },
              },
            }),
            response.create({
              logger,
              resolve: K,
            })
          );

          expect(result).toMatchSnapshot();
        });
      });

      describe('- with non-model data', () => {
        let subject: Action<any>;

        beforeAll(async () => {
          const { router, controllers } = await getTestApp();
          const controller: Controller = controllers.get('posts');

          subject = resource(() => Promise.resolve(null), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toEqual(expect.any(Function));
          expect(subject).toHaveLength(2);
        });

        it('resolves with the result of the action', async () => {
          const result = await subject(
            request.create({
              logger,
              url: '/posts/test',
              params: {
                id: 1,
              },
              method: 'GET',
              headers: new Map([
                ['host', DOMAIN],
              ]),
              encrypted: false,
              defaultParams: {},
            }),
            response.create({
              logger,
              resolve: K,
            })
          );

          expect(result).toBeNull();
        });
      });
    });
  });
});
