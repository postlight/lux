// @flow
import Logger from '../../logger';
import { request, response } from '../../adapter/mock';
import noop from '../../../utils/noop';
import * as responder from '../index';

describe('module "responder"', () => {
  describe('#createResponder()', () => {
    let respond;
    let resolve;

    const logger = new Logger({
      level: 'ERROR',
      format: 'text',
      filter: {
        params: [],
      },
      enabled: false,
    });

    beforeEach(() => {
      resolve = jest.fn(noop);
      respond = responder.create(
        request.create({
          logger,
          url: '/health',
          params: {},
          method: 'GET',
          headers: new Map(),
          encrypted: false,
          defaultParams: {},
        }),
        response.create({
          logger,
          resolve,
        })
      );
    });

    afterEach(() => {
      resolve.mockClear();
    });

    it('creates a #respond() function', () => {
      expect(respond).not.toThrow();
      expect(respond).toHaveLength(1);
    });

    describe('#respond()', () => {
      describe('- responding with a string', () => {
        it('works as expected', () => {
          expect(() => respond('Hello World')).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });
      });

      describe('- responding with a number', () => {
        it('works with `204`', () => {
          expect(() => respond(204)).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });

        it('works with `400`', () => {
          expect(() => respond(400)).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });

        it('invalid status codes result in `404`', () => {
          expect(() => respond(1000)).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });
      });

      describe('- responding with a boolean', () => {
        it('works with `true`', () => {
          expect(() => respond(true)).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });

        it('works with `false`', () => {
          expect(() => respond(false)).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });
      });

      describe('- responding with an object', () => {
        it('works with `null`', () => {
          expect(() => respond(null)).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });

        it('works with an object', () => {
          expect(() => respond({ test: true })).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });

        it('works with an array', () => {
          expect(() => respond(['test', true])).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });
      });

      describe('- responding with an error', () => {
        it('works with vanilla errors', () => {
          expect(() => respond(new Error('test'))).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });

        it('works with errors containing a `statusCode` property', () => {
          class ForbiddenError extends Error {
            statusCode = 403;

            constructor() {
              super('Forbidden');
            }
          }

          expect(() => respond(new ForbiddenError())).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });
      });

      describe('- responding with undefined', () => {
        it('works as expected', () => {
          expect(respond).not.toThrow();
          expect(resolve.mock.calls).toMatchSnapshot();
        });
      });
    });
  });
});
