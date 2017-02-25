// @flow
import { IncomingMessage, ServerResponse } from 'http';

import { MIME_TYPE } from '../../jsonapi';
import Logger from '../../logger';
import createAdapter, { request, response } from '../http';
import { getTestApp } from '../../../../test/utils/test-app';

const logger = new Logger({
  level: 'ERROR',
  format: 'text',
  filter: {
    params: [],
  },
  enabled: false,
});

describe('module "adapter/http"', () => {
  let app;
  let req;
  let res;
  let adapter;

  beforeAll(async () => {
    app = await getTestApp();
    adapter = createAdapter(app);
  });

  afterAll(async () => {
    await app.destroy();
  });

  describe('#default()', () => {
    beforeEach(() => {
      req = new IncomingMessage({
        encrypted: false,
      });

      Object.assign(req, {
        url: '/posts',
        method: 'GET',
      });

      res = new ServerResponse(req);
    });

    it('resolves with a request/response tuple', async () => {
      expect(await adapter(req, res)).toMatchSnapshot();
    });
  });

  describe('#request', () => {
    describe('#create()', () => {
      describe('- with body', () => {
        let promise;

        describe('- with error', () => {
          beforeEach(() => {
            req = new IncomingMessage({
              encrypted: false,
            });

            Object.assign(req, {
              url: '/posts',
              method: 'POST',
              headers: {
                'content-type': MIME_TYPE,
                'content-length': 0,
              },
            });

            promise = request.create(req, logger);

            req.emit('error', new Error('Test'));
          });

          it('builds a request from an http.IncomingMessage', async () => {
            await promise.catch(err => {
              expect(err).toBeInstanceOf(Error);
            });
          });
        });

        describe('- without error', () => {
          beforeEach(() => {
            const data = JSON.stringify({
              data: {
                type: 'posts',
                attributes: {
                  body: '',
                  title: 'New Post',
                  'is-public': false,
                },
              },
            });

            req = new IncomingMessage({
              encrypted: false,
            });

            Object.assign(req, {
              url: '/posts',
              method: 'POST',
              headers: {
                'content-type': MIME_TYPE,
                'content-length': data.length,
              },
            });

            promise = request.create(req, logger);

            req.push(data);
            req.push(null);
          });

          it('builds a request from an http.IncomingMessage', async () => {
            expect(await promise).toMatchSnapshot();
          });
        });
      });

      describe('- without body', () => {
        let subject;

        beforeEach(() => {
          req = new IncomingMessage({
            encrypted: false,
          });

          Object.assign(req, {
            url: '/posts',
            method: 'GET',
          });

          subject = request.create(req, logger);
        });

        it('builds a request from an http.IncomingMessage', () => {
          expect(subject).toMatchSnapshot();
        });
      });
    });
  });

  describe('#response', () => {
    describe('#create()', () => {
      let subject;

      beforeEach(() => {
        subject = response.create(res, logger);
      });

      it('builds a response from an http.ServerResponse', () => {
        expect(subject).toMatchSnapshot();
      });

      describe('=> Response', () => {
        ['end', 'send'].forEach(method => {
          beforeAll(() => {
            Reflect.set(res, 'end', jest.fn());
          });

          afterAll(() => {
            Reflect.set(res, 'end', ServerResponse.prototype.end);
          });

          afterEach(() => {
            res.end.mockClear();
          });

          describe(`#${method}()`, () => {
            it('calls the http.ServerResponse#end', () => {
              const body = 'Test';

              if (method === 'end') {
                subject.end(body);
              } else {
                subject.send(body);
              }

              expect(res.end).toBeCalledWith(body);
            });
          });
        });

        describe('#status()', () => {
          const value = 201;

          it('returns `this`', () => {
            expect(subject.status(value)).toBe(subject);
          });

          it('properly modifies the status code', () => {
            subject.status(value);

            expect(subject).toMatchSnapshot();
            expect(res.statusCode).toBe(value);
          });
        });

        describe('#getHeader()', () => {
          const key = 'Content-Type';
          const value = MIME_TYPE;

          beforeEach(() => {
            subject.headers.set(key, value);
          });

          it('proxies headers#get()', () => {
            expect(subject.getHeader(key)).toBe(value);
            expect(res.getHeader(key)).toBe(value);
          });
        });

        describe('#setHeader()', () => {
          beforeEach(() => {
            subject.headers.set('Content-Type', MIME_TYPE);
          });

          it('proxies headers#set()', () => {
            subject.setHeader('X-Test-Header', 'true');

            expect(subject.headers).toMatchSnapshot();
            subject.headers.forEach((value, key) => {
              expect(res.getHeader(key)).toBe(value);
            });
          });
        });

        describe('#removeHeader()', () => {
          beforeEach(() => {
            subject.headers
              .set('Content-Type', MIME_TYPE)
              .set('X-Test-Header', 'true');
          });

          it('proxies headers#delete()', () => {
            subject.removeHeader('X-Test-Header');

            expect(subject.headers).toMatchSnapshot();
            subject.headers.forEach((value, key) => {
              expect(res.getHeader(key)).toBe(value);
            });
          });
        });
      });
    });
  });
});
