// @flow
import fetch from 'node-fetch';
import { createServer } from 'http';
import { parse as parseURL } from 'url';

import { MIME_TYPE } from '../../../jsonapi';
import { getDomain, createRequest, parseRequest } from '../index';

import { getTestApp } from '../../../../../test/utils/get-test-app';

const DOMAIN = 'http://localhost:4100';

describe('module "server/request"', () => {
  let run;

  beforeAll(async () => {
    const { logger, router } = await getTestApp();

    run = (path, opts, fn) => {
      const server = createServer((req, res) => {
        req = createRequest(req, {
          logger,
          router
        });

        const close = () => {
          res.statusCode = 200;
          res.end();
        };

        Promise.resolve(fn(req)).then(close, close);
      });

      const cleanup = () => {
        server.close();
      };

      server.listen(4100);

      return fetch(DOMAIN + path, opts).then(cleanup, cleanup);
    };
  });

  describe('#getDomain()', () => {
    it('returns the domain (`${PROTOCOL}://${HOST}`) of a request', () => {
      return run('/post', {
        headers: {
          host: 'localhost'
        }
      }, req => {
        expect(getDomain(req)).toBe(DOMAIN);
      });
    });
  });

  describe('#createRequest()', () => {
    it('can create a Request from an http.IncomingMessage', () => {
      return run('/posts', {
        headers: {
          'x-test': 'true'
        }
      }, ({ url, route, method, logger, headers }) => {
        expect(url).toEqual(parseURL(`${DOMAIN}/posts`));
        expect(route).not.toThrow();
        expect(method).toBe('GET');
        expect(logger).toBe(logger);
        expect(headers instanceof Map).toBe(true);
        expect(headers.get('x-test')).toBe('true');
      });
    });

    it('accepts a HTTP-Method-Override header', () => {
      return run('/posts', {
        method: 'POST',
        headers: {
          'HTTP-Method-Override': 'PATCH'
        }
      }, async ({ method }) => {
        expect(method).toBe('PATCH');
      });
    });
  });

  describe('#parseRequest()', () => {
    it('can parse params from a GET request', () => {
      const now = new Date().toISOString();
      const url = (
        '/posts?'
        + 'fields[posts]=body,title'
        + '&fields[users]=name'
        + '&include=user'
        + '&filter[is-public]=true'
        + '&filter[title]=123'
        + '&filter[body]=null'
        + `&filter[created-at]=${now}`
      );

      return run(url, {
        method: 'GET'
      }, async req => {
        expect(await parseRequest(req)).toEqual({
          fields: ['body', 'title'],
          include: ['user'],
          filter: {
            body: null,
            title: 123,
            isPublic: true,
            createdAt: expect.any(Date)
          }
        });
      });
    });

    it('can parse params from a POST request', () => {
      const now = new Date().toISOString();

      return run('/posts?include=user', {
        method: 'POST',
        body: {
          data: {
            type: 'posts',
            attributes: {
              title: 'New Post 1',
              'is-public': true,
              intString: '123',
              nullString: 'null',
              boolString: 'true',
              dateString: now
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: 1
                }
              },
              tags: {
                data: [
                  {
                    type: 'tags',
                    id: 1
                  },
                  {
                    type: 'tags',
                    id: 2
                  },
                  {
                    type: 'tags',
                    id: 3
                  }
                ]
              }
            }
          }
        },
        headers: {
          'Content-Type': MIME_TYPE
        }
      }, async req => {
        expect(await parseRequest(req)).toEqual({
          data: {
            type: 'posts',
            attributes: {
              title: 'New Post 1',
              isPublic: true,
              intString: '123',
              nullString: 'null',
              boolString: 'true',
              dateString: now
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: 1
                }
              },
              tags: {
                data: [
                  {
                    type: 'tags',
                    id: 1
                  },
                  {
                    type: 'tags',
                    id: 2
                  },
                  {
                    type: 'tags',
                    id: 3
                  }
                ]
              }
            }
          },
          include: ['user']
        });
      });
    });

    it('can parse params from a PATCH request', () => {
      const now = new Date().toISOString();

      return run('/posts/1?include=user', {
        method: 'PATCH',
        data: {
          id: 1,
          type: 'posts',
          attributes: {
            title: 'New Post 1',
            'is-public': true,
            intString: '123',
            nullString: 'null',
            boolString: 'true',
            dateString: now
          },
          relationships: {
            user: {
              data: {
                type: 'users',
                id: 1
              }
            },
            tags: {
              data: [
                {
                  type: 'tags',
                  id: 1
                },
                {
                  type: 'tags',
                  id: 2
                },
                {
                  type: 'tags',
                  id: 3
                }
              ]
            }
          }
        },
        headers: {
          'Content-Type': MIME_TYPE
        }
      }, async req => {
        expect(await parseRequest(req)).toEqual({
          data: {
            type: 'posts',
            attributes: {
              title: 'New Post 1',
              isPublic: true,
              intString: '123',
              nullString: 'null',
              boolString: 'true',
              dateString: now
            },
            relationships: {
              user: {
                data: {
                  type: 'users',
                  id: 1
                }
              },
              tags: {
                data: [
                  {
                    type: 'tags',
                    id: 1
                  },
                  {
                    type: 'tags',
                    id: 2
                  },
                  {
                    type: 'tags',
                    id: 3
                  }
                ]
              }
            }
          },
          include: ['user']
        });
      });
    });

    it('rejects when a POST request body is invalid', () => {
      return run('/posts', {
        method: 'POST',
        body: '{[{not json,,,,,}]}',
        headers: {
          'Content-Type': MIME_TYPE
        }
      }, req => {
        return parseRequest(req).catch(err => {
          expect(err instanceof SyntaxError).toBe(true);
        });
      });
    });

    it('rejects when a PATCH request body is invalid', () => {
      return run('/posts', {
        method: 'PATCH',
        body: '{[{not json,,,,,}]}',
        headers: {
          'Content-Type': MIME_TYPE
        }
      }, req => {
        return parseRequest(req).catch(err => {
          expect(err instanceof SyntaxError).toBe(true);
        });
      });
    });
  });
});
