import { line } from '../logger';

import encrypt from './utils/encrypt';
import decrypt from './utils/decrypt';
import tryCatch from '../../utils/try-catch';

const { assign, defineProperties } = Object;

const { env: { NODE_ENV = 'development' } } = process;

class Session {
  data = {};
  didChange = false;

  constructor({ cookie = '', logger, sessionKey, sessionSecret } = {}) {
    defineProperties(this, {
      cookie: {
        value: cookie,
        writable: true,
        enumerable: true,
        configurable: false
      },

      logger: {
        value: logger,
        writable: false,
        enumerable: true,
        configurable: false
      },

      sessionKey: {
        value: sessionKey,
        writable: false,
        enumerable: true,
        configurable: false
      },

      sessionSecret: {
        value: sessionSecret,
        writable: false,
        enumerable: true,
        configurable: false
      }
    });

    if (cookie) {
      cookie = `; ${cookie}`.split(`; ${sessionKey}=`);
      cookie = cookie.length === 2 ? cookie.pop() : null;
    }

    this.updateCookie(cookie);

    return this;
  }

  updateCookie(value) {
    const { sessionSecret } = this;

    if (value) {
      tryCatch(() => {
        assign(this, {
          data: JSON.parse(decrypt(value, sessionSecret)),
          cookie: value
        });
      }, () => {
        if (NODE_ENV === 'development') {
          this.logger.error(line`
            Error: Unable to decrypt "${this.sessionKey}". Make sure your
            configuration for "${NODE_ENV}" has the correct sessionSecret.
          `);
        }

        assign(this, {
          cookie: encrypt('{}', sessionSecret),
          didChange: true
        });
      });
    } else {
      assign(this, {
        cookie: encrypt('{}', sessionSecret),
        didChange: true
      });
    }
  }

  get isAuthenticated() {
    const currentUserId = this.get('currentUserId');

    return typeof currentUserId !== 'undefined';
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    if (key && value) {
      this.data[key] = value;
      this.updateCookie();
    }
  }

  delete(key) {
    if (key) {
      delete this.data[key];
      this.updateCookie();
    }
  }
}

export default Session;
