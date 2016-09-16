// @flow
import fetch from 'node-fetch';
import { expect } from 'chai';
import { it, before, after, describe } from 'mocha';

import Server from '../index';

import { getTestApp } from '../../../../test/utils/get-test-app';

import type Application from '../../application';

const PORT = 4100;
const DOMAIN = `http://localhost:${PORT}`;

describe('module "server"', () => {
  describe('class Server', () => {
    let subject;

    before(async () => {
      const { logger, router }: Application = await getTestApp();

      subject = new Server({
        logger,
        router,
        cors: {
          enabled: false
        }
      });

      subject.listen(PORT);
    });

    after(() => {
      subject.instance.close();
    });

    describe('#listen()', () => {
      it('enables incoming connections to reach the application', () => {
        return fetch(`${DOMAIN}/health`).then(({ status }) => {
          expect(status).to.equal(204);
        });
      });
    });
  });
});
