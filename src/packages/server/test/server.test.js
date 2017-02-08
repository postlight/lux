// @flow
import fetch from 'node-fetch';


import Server from '../index';

import { getTestApp } from '../../../../test/utils/get-test-app';

const PORT = 4100;
const DOMAIN = `http://localhost:${PORT}`;

describe('module "server"', () => {
  describe('class Server', () => {
    let subject;

    beforeAll(async () => {
      const { logger, router } = await getTestApp();

      subject = new Server({
        logger,
        router,
        cors: {
          enabled: false
        }
      });

      subject.listen(PORT);
    });

    afterAll(() => {
      subject.instance.close();
    });

    describe('#listen()', () => {
      it('enables incoming connections to reach the application', () => {
        return fetch(`${DOMAIN}/health`).then(({ status }) => {
          expect(status).toBe(204);
        });
      });
    });
  });
});
