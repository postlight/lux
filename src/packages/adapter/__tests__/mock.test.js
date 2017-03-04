/* @flow */

import { MIME_TYPE } from '../../jsonapi';
import Logger from '../../logger';
import createAdapter, { request, response } from '../mock';
import { getTestApp } from '../../../../test/utils/test-app';

const logger = new Logger({
  level: 'ERROR',
  format: 'text',
  filter: {
    params: [],
  },
  enabled: false,
});

describe('module "adapter/mock"', () => {
  let app;
  let adapter;

  beforeAll(async () => {
    app = await getTestApp();
    adapter = createAdapter(app);
  });

  afterAll(async () => {
    await app.destroy();
  });

  describe('#default()', () => {
    it('resolves with a request/response tuple', async () => {
      const result = await adapter({
        logger,
        url: '/posts',
        method: 'GET',
        headers: {
          Accept: MIME_TYPE,
        },
      });

      expect(result).toMatchSnapshot();
    });
  });

  describe('#request', () => {
    describe('#create()', () => {
      let subject;

      describe('- with `body`', () => {
        beforeEach(() => {
          subject = request.create({
            logger,
            url: '/posts',
            method: 'POST',
            body: {
              data: {
                type: 'posts',
                attributes: {
                  body: '',
                  title: 'New Post',
                  'is-public': false,
                },
              },
            },
            headers: {
              Accept: MIME_TYPE,
              'Content-Type': MIME_TYPE,
            },
          });
        });

        it('builds a request from an options object', () => {
          expect(subject).toMatchSnapshot();
        });
      });

      describe('- without `body`', () => {
        beforeEach(() => {
          subject = request.create({
            logger,
            url: '/posts',
            method: 'GET',
            headers: {
              Accept: MIME_TYPE,
            },
          });
        });

        it('builds a request from an options object', () => {
          expect(subject).toMatchSnapshot();
        });
      });
    });
  });

  describe('#response', () => {
    describe('#create()', () => {
      let subject;

      describe('- with a resolver function', () => {
        const resolve = jest.fn();

        beforeEach(() => {
          subject = response.create({
            logger,
            resolve,
          });
        });

        afterEach(() => {
          resolve.mockClear();
        });

        it('builds a response from an options object', () => {
          expect(subject).toMatchSnapshot();
        });

        describe('=> Response', () => {
          ['end', 'send'].forEach(method => {
            describe(`#${method}()`, () => {
              it('calls the resolver function', () => {
                const body = 'Test';

                if (method === 'end') {
                  subject.end(body);
                } else {
                  subject.send(body);
                }

                expect(resolve.mock.calls).toMatchSnapshot();
              });
            });
          });
        });
      });

      describe('- without a resolver function', () => {
        beforeEach(() => {
          subject = response.create({
            logger
          });
        });

        it('builds a response from an options object', () => {
          expect(subject).toMatchSnapshot();
        });

        describe('=> Response', () => {
          describe('#status()', () => {
            it('returns `this`', () => {
              expect(subject.status(201)).toBe(subject);
              expect(subject).toMatchSnapshot();
            });
          });

          describe('#getHeader()', () => {
            beforeEach(() => {
              subject.headers.set('Content-Type', MIME_TYPE);
            });

            it('proxies headers#get()', () => {
              expect(subject.getHeader('Content-Type')).toBe(MIME_TYPE);
              expect(subject.getHeader('X-Test-Header')).toBeUndefined();
            });
          });

          describe('#setHeader()', () => {
            it('proxies headers#set()', () => {
              subject.setHeader('Content-Type', MIME_TYPE);
              expect(subject.headers.get('Content-Type')).toBe(MIME_TYPE);
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
            });
          });
        });
      });
    });
  });
});
