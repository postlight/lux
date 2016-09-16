// @flow
import fetch from 'node-fetch';
import { expect } from 'chai';
import { createServer } from 'http';
import { parse as parseURL } from 'url';
import { it, describe, before } from 'mocha';

import { MIME_TYPE } from '../../../jsonapi';
import { getDomain, createRequest, parseRequest } from '../index';

import { getTestApp } from '../../../../../test/utils/get-test-app';

import type Application from '../../../application';

const DOMAIN = 'http://localhost:4100';

describe('module "server/request"', () => {
  let test;

  before(async () => {
    const { logger, router }: Application = await getTestApp();

    test = (path, opts, fn) => {
      const server = createServer((req, res) => {
        req = createRequest(req, {
          logger,
          router
        });

        const close = () => {
          res.statusCode = 200;
          res.end();
        };

        fn(req).then(close, close);
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
      return test('/post', {
        headers: {
          host: 'localhost'
        }
      }, async req => {
        const result = getDomain(req);

        expect(result).to.equal(DOMAIN);
      });
    });
  });

  describe('#createRequest()', () => {
    it('can create a Request from an http.IncomingMessage', () => {
      return test('/posts', {
        headers: {
          'x-test': 'true'
        }
      }, async ({ url, route, method, logger, headers }) => {
        const parsed = parseURL(`${DOMAIN}/posts`);

        expect(url).to.deep.equal(parsed);
        expect(route).to.be.ok;
        expect(method).to.equal('GET');
        expect(logger).to.equal(logger);
        expect(headers).to.be.an.instanceof(Map);
        expect(headers.get('x-test')).to.equal('true');
      });
    });

    it('accepts a HTTP-Method-Override header', () => {
      return test('/posts', {
        method: 'POST',
        headers: {
          'HTTP-Method-Override': 'PATCH'
        }
      }, async ({ method }) => {
        expect(method).to.equal('PATCH');
      });
    });
  });

  describe('#parseRequest()', () => {
    it('can parse params from a GET request', () => {
      const url = '/posts?'
        + 'fields[posts]=body,title'
        + '&fields[users]=name'
        + '&include=user';

      return test(url, {
        method: 'GET'
      }, async req => {
        const params = await parseRequest(req);

        expect(params).to.deep.equal({
          fields: ['body', 'title'],
          include: ['user']
        });
      });
    });

    it('can parse params from a POST request', () => {
      return test('/posts?include=user', {
        method: 'POST',
        body: {
          data: {
            type: 'posts',
            attributes: {
              title: 'New Post 1',
              'is-public': true
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
        const params = await parseRequest(req);

        expect(params).to.deep.equal({
          data: {
            type: 'posts',
            attributes: {
              title: 'New Post 1',
              isPublic: true
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
      return test('/posts/1?include=user', {
        method: 'PATCH',
        data: {
          id: 1,
          type: 'posts',
          attributes: {
            title: 'New Post 1',
            'is-public': true
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
        const params = await parseRequest(req);

        expect(params).to.deep.equal({
          data: {
            type: 'posts',
            attributes: {
              title: 'New Post 1',
              isPublic: true
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
      return test('/posts', {
        method: 'POST',
        body: '{[{not json,,,,,}]}',
        headers: {
          'Content-Type': MIME_TYPE
        }
      }, req => {
        return parseRequest(req).catch(err => {
          expect(err).to.be.an.instanceof(SyntaxError);
        });
      });
    });

    it('rejects when a PATCH request body is invalid', () => {
      return test('/posts', {
        method: 'PATCH',
        body: '{[{not json,,,,,}]}',
        headers: {
          'Content-Type': MIME_TYPE
        }
      }, req => {
        return parseRequest(req).catch(err => {
          expect(err).to.be.an.instanceof(SyntaxError);
        });
      });
    });
  });
});
