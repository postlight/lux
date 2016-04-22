import { expect } from 'chai';
import { randomBytes } from 'crypto';
import fetch from 'isomorphic-fetch';

import encrypt from '../../../src/packages/session/utils/encrypt';
import config from '../../test-app/config/environments/test.json';

const host = 'http://localhost:4000';

describe('Unit: class Session ', () => {
  describe('Regression: #updateCookie() (https://github.com/postlight/lux/issues/50)', () => {
    it('defaults to empty session upon a decryption error', async () => {
      const session = encrypt('{}', randomBytes(32).toString('hex'));
      const { status, headers } = await fetch(`${host}/posts`, {
        headers: new Headers({
          'Cookie': `${config.sessionKey}=${session};`
        })
      });

      expect(status).to.equal(200);
    });
  });
});
