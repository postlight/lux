// @flow
import fetch from 'node-fetch';
import { createServer } from 'http';

import { MIME_TYPE, VERSION } from '../../../jsonapi';
import { createRequest } from '../../request';
import { createResponse } from '../../response';
import { createResponder } from '../index';

import { getTestApp } from '../../../../../test/utils/get-test-app';

const DOMAIN = 'http://localhost:4100';

describe('module "server/responder"', () => {
  let run;

  beforeAll(async () => {
    const { logger, router } = await getTestApp();

    run = fn => new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
        req = createRequest(req, {
          logger,
          router
        });

        res = createResponse(res, {
          logger
        });

        fn(req, res);
      }).listen(4100);

      const cleanup = () => {
        server.close();
      };

      return fetch(DOMAIN)
        .then(res => {
          resolve(res);
          cleanup();
        })
        .catch(err => {
          reject(err);
          cleanup();
        });
    });
  });

  describe('#createResponder()', () => {
    it('creates a #respond() function', () => {
      return run((req, res) => {
        const result = createResponder(req, res);

        expect(result).toBe(expect.any(Function));
        expect(result.length).toBe(1);
        expect(result).not.toThrow();
      });
    });

    describe('#respond()', () => {
      describe('- responding with a string', () => {
        it('works as expected', async () => {
          const result = await run((req, res) => {
            res.setHeader('Content-Type', 'text/plain');
            createResponder(req, res)('Hello World');
          });

          expect(result.status).toBe(200);
          expect(result.headers.get('Content-Type')).toBe('text/plain');
          expect(await result.text()).toBe('Hello World');
        });
      });

      describe('- responding with a number', () => {
        it('works with `204`', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)(204);
          });

          expect(result.status).toBe(204);
          expect(result.headers.get('Content-Type')).toBeNull();
          expect(await result.text()).toBe('');
        });

        it('works with `400`', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)(400);
          });

          expect(result.status).toBe(400);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual({
            errors: [
              {
                status: '400',
                title: 'Bad Request'
              }
            ],
            jsonapi: {
              version: VERSION
            }
          });
        });
      });

      describe('- responding with a boolean', () => {
        it('works with `true`', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)(true);
          });

          expect(result.status).toBe(204);
          expect(result.headers.get('Content-Type')).toBeNull();
          expect(await result.text()).toBe('');
        });

        it('works with `false`', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)(false);
          });

          expect(result.status).toBe(401);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual({
            errors: [
              {
                status: '401',
                title: 'Unauthorized'
              }
            ],
            jsonapi: {
              version: VERSION
            }
          });
        });
      });

      describe('- responding with an object', () => {
        it('works with `null`', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)(null);
          });

          expect(result.status).toBe(404);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual({
            errors: [
              {
                status: '404',
                title: 'Not Found'
              }
            ],
            jsonapi: {
              version: VERSION
            }
          });
        });

        it('works with an object', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)({ test: true });
          });

          expect(result.status).toBe(200);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual({ test: true });
        });

        it('works with an array', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)(['test', true]);
          });

          expect(result.status).toBe(200);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual(['test', true]);
        });
      });

      describe('- responding with an error', () => {
        it('works with vanilla errors', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)(new Error('test'));
          });

          expect(result.status).toBe(500);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual({
            errors: [
              {
                status: '500',
                title: 'Internal Server Error',
                detail: 'test'
              }
            ],
            jsonapi: {
              version: VERSION
            }
          });
        });

        it('works with errors containing a `statusCode` property', async () => {
          const result = await run((req, res) => {
            class ForbiddenError extends Error {
              statusCode = 403;
            }

            createResponder(req, res)(new ForbiddenError('test'));
          });

          expect(result.status).toBe(403);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual({
            errors: [
              {
                status: '403',
                title: 'Forbidden',
                detail: 'test'
              }
            ],
            jsonapi: {
              version: VERSION
            }
          });
        });
      });

      describe('- responding with undefined', () => {
        it('works as expected', async () => {
          const result = await run((req, res) => {
            createResponder(req, res)();
          });

          expect(result.status).toBe(404);
          expect(result.headers.get('Content-Type')).toBe(MIME_TYPE);
          expect(await result.json()).toEqual({
            errors: [
              {
                status: '404',
                title: 'Not Found'
              }
            ],
            jsonapi: {
              version: VERSION
            }
          });
        });
      });
    });
  });
});
