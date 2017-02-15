// @flow
import Logger from '../../../../logger';
import { request, response } from '../../../../adapter/mock';
import noop from '../../../../../utils/noop';
import { getTestApp } from '../../../../../../test/utils/get-test-app';
import resource from '../enhancers/resource';

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
      let subject;
      let mockArgs;

      beforeAll(async () => {
        const { router, controllers } = await getTestApp();
        const controller = controllers.get('posts');

        subject = resource(controller.index.bind(controller), controller);
        mockArgs = () => {
          const req = request.create({
            logger,
            url: '/posts',
            params: {},
            method: 'GET',
            headers: {
              host: DOMAIN,
            },
            encrypted: false,
            defaultParams: {},
          });

          const res = response.create({
            logger,
            resolve: noop,
          });

          Object.assign(req.defaultParams, {
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
          });

          return [req, res];
        };
      });

      it('returns an enhanced action', () => {
        expect(subject).toBeInstanceOf(Function);
        expect(subject).toHaveLength(2);
      });

      it('resolves with a serialized payload', async () => {
        const [req, res] = mockArgs();

        expect(await subject(req, res)).toMatchSnapshot();
      });
    });

    describe('- type "member"', () => {
      describe('- with "root" namespace', () => {
        let subject;

        beforeAll(async () => {
          const { router, controllers } = await getTestApp();
          const controller = controllers.get('posts');

          subject = resource(controller.show.bind(controller), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toBeInstanceOf(Function);
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
              headers: {
                host: DOMAIN,
              },
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
              resolve: noop,
            })
          );

          expect(result).toMatchSnapshot();
        });
      });

      describe('- with "admin" namespace', () => {
        let subject;

        beforeAll(async () => {
          const { router, controllers } = await getTestApp();
          const controller = controllers.get('admin/posts');

          subject = resource(controller.show.bind(controller), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toBeInstanceOf(Function);
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
              headers: {
                host: DOMAIN,
              },
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
              resolve: noop,
            })
          );

          expect(result).toMatchSnapshot();
        });
      });

      describe('- with non-model data', () => {
        let subject;

        beforeAll(async () => {
          const { router, controllers } = await getTestApp();
          const controller = controllers.get('posts');

          subject = resource(() => Promise.resolve(null), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toBeInstanceOf(Function);
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
              headers: {
                host: DOMAIN,
              },
              encrypted: false,
              defaultParams: {},
            }),
            response.create({
              logger,
              resolve: noop,
            })
          );

          expect(result).toBeNull();
        });
      });
    });
  });
});
