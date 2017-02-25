// @flow
import { VERSION } from '../../../../jsonapi';
import Logger from '../../../../logger';
import { request, response } from '../../../../adapter/mock';
import noop from '../../../../../utils/noop';
import { getTestApp } from '../../../../../../test/utils/test-app';
import resource from '../enhancers/resource';

const DOMAIN = 'localhost:4000';
const DEFAULT_FIELDS = {
  posts: [
    'body',
    'title',
    'createdAt',
    'updatedAt',
  ],
  users: [
    'id',
  ],
  images: [
    'id',
  ],
  comments: [
    'id',
  ],
  reactions: [
    'id',
  ],
  tags: [
    'id',
  ],
};

const logger = new Logger({
  level: 'ERROR',
  format: 'text',
  filter: {
    params: [],
  },
  enabled: false,
});

describe('module "router/route/action"', () => {
  let app;

  beforeAll(async () => {
    app = await getTestApp();
  });

  afterAll(async () => {
    await app.destroy();
  });

  describe('enhancer resource()', () => {
    describe('- type "collection"', () => {
      let subject;

      const mockArgs = () => {
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
          fields: DEFAULT_FIELDS,
        });

        return [req, res];
      };

      beforeAll(() => {
        const controller = app.controllers.get('posts');
        // $FlowIgnore
        subject = resource(controller.index.bind(controller), controller);
      });

      it('returns an enhanced action', () => {
        expect(subject).toBeInstanceOf(Function);
        expect(subject).toHaveLength(2);
      });

      it('resolves with a serialized payload', async () => {
        const [req, res] = mockArgs();

        expect(await subject(req, res)).toEqual(
          expect.objectContaining({
            data: expect.arrayContaining([
              expect.anything(),
            ]),
            links: expect.objectContaining({
              self: expect.any(String),
            }),
            jsonapi: {
              version: VERSION,
            },
          })
        );
      });
    });

    describe('- type "member"', () => {
      const mockArgs = url => {
        const req = request.create({
          url,
          logger,
          params: {},
          method: 'GET',
          headers: {
            host: DOMAIN,
          },
          encrypted: false,
          defaultParams: {
            fields: DEFAULT_FIELDS,
          },
        });

        const res = response.create({
          logger,
          resolve: noop,
        });

        Object.assign(req.params, {
          id: 1,
        });

        Object.assign(req.defaultParams, {
          fields: DEFAULT_FIELDS,
        });

        return [req, res];
      };

      const getExpectedResult = () => (
        expect.objectContaining({
          data: expect.objectContaining({
            id: '1',
            type: 'posts',
            attributes: expect.anything(),
            relationships: expect.anything(),
          }),
          links: expect.objectContaining({
            self: expect.any(String),
          }),
          jsonapi: {
            version: VERSION,
          },
        })
      );

      describe('- with "root" namespace', () => {
        let subject;

        beforeAll(() => {
          const controller = app.controllers.get('posts');

          // $FlowIgnore
          subject = resource(controller.show.bind(controller), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toBeInstanceOf(Function);
          expect(subject).toHaveLength(2);
        });

        it('resolves with a serialized payload', async () => {
          const [req, res] = mockArgs('/posts/1');

          expect(await subject(req, res)).toEqual(getExpectedResult());
        });
      });

      describe('- with "admin" namespace', () => {
        let subject;

        beforeAll(async () => {
          const controller = app.controllers.get('admin/posts');

          // $FlowIgnore
          subject = resource(controller.show.bind(controller), controller);
        });

        it('returns an enhanced action', () => {
          expect(subject).toBeInstanceOf(Function);
          expect(subject).toHaveLength(2);
        });

        it('resolves with a serialized payload', async () => {
          const [req, res] = mockArgs('/admin/posts/1');

          expect(await subject(req, res)).toEqual(getExpectedResult());
        });
      });

      describe('- with non-model data', () => {
        let subject;

        beforeAll(() => {
          const controller = app.controllers.get('posts');

          // $FlowIgnore
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
              params: {},
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
