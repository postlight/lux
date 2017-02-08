// @flow
import fetch from 'node-fetch';

import { createServer } from 'http';

import { createResponse } from '../index';

import { getTestApp } from '../../../../../test/utils/get-test-app';

const DOMAIN = 'http://localhost:4100';

describe('module "server/response"', () => {
  let run;

  beforeAll(async () => {
    const { logger } = await getTestApp();

    run = (path, fn) => {
      const server = createServer((req, res) => {
        res = createResponse(res, {
          logger
        });

        const close = () => {
          res.statusCode = 200;
          res.end();
        };

        fn(res).then(close, close);
      });

      const cleanup = () => {
        server.close();
      };

      server.listen(4100);

      return fetch(DOMAIN + path).then(cleanup, cleanup);
    };
  });

  describe('#createResponse()', () => {
    it('can create a Response from an http.ServerResponse', () => {
      return run('/posts', async ({ stats }) => {
        expect(stats).toEqual([]);
      });
    });
  });
});
