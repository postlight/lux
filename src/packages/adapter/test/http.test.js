// @flow
import { IncomingMessage, ServerResponse } from 'http';

import { MIME_TYPE } from '../../jsonapi';
import Logger from '../../logger';
import createAdapter, { request, response } from '../http';
import { getTestApp } from '../../../../test/utils/get-test-app';

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
  });

  beforeAll(() => {
    adapter = createAdapter(app);
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
      let subject;

      describe.skip('- with body', () => {
        beforeEach(async () => {
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
              'Content-Type': MIME_TYPE,
              'Content-Length': data.length,
            },
          });

          const promise = request.create(req, logger);
          const body = Buffer.allocUnsafe(data.length);

          body.write(data);
          req.push(body);

          subject = await promise;
        });

        it('builds a request object from an http.IncomingMessage', () => {
          expect(subject).toMatchSnapshot();
        });
      });

      describe('- without body', () => {
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

        it('builds a request object from an http.IncomingMessage', () => {
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

      it('builds a response object from an http.ServerResponse', () => {
        expect(subject).toMatchSnapshot();
      });
    });
  });
});
