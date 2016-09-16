// @flow
import fetch from 'node-fetch';
import { expect } from 'chai';
import { createServer } from 'http';
import { it, describe, before } from 'mocha';

import { createResponse } from '../index';

import { getTestApp } from '../../../../../test/utils/get-test-app';

const DOMAIN = 'http://localhost:4100';

describe('module "server/response"', () => {
  let test;

  before(async () => {
    const { logger } = await getTestApp();

    test = (path, fn) => {
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
      return test('/posts', async ({ stats }) => {
        expect(stats).to.deep.equal([]);
      });
    });
  });
});
