import Base from '../base';

import { line } from '../logger';

import encrypt from './utils/encrypt';
import decrypt from './utils/decrypt';
import tryCatch from '../../utils/try-catch';

class Session extends Base {
  data = {};

  cookie = '';

  didChange = false;

  constructor(props = {}) {
    let { cookie, logger, sessionKey, sessionSecret } = props;

    super({
      logger,
      sessionKey,
      sessionSecret
    });

    if (cookie) {
      cookie = `; ${cookie}`.split(`; ${sessionKey}=`);
      cookie = cookie.length === 2 ? cookie.pop() : null;
    }

    this.updateCookie(cookie);
  }

  updateCookie(value) {
    const { sessionSecret } = this;

    if (value) {
      tryCatch(() => {
        this.setProps({
          data: JSON.parse(decrypt(value, sessionSecret)),
          cookie: value
        });
      }, () => {
        const { environment } = this;

        if (environment === 'development') {
          this.logger.error(line`
            Error: Unable to decrypt "${this.sessionKey}". Make sure your
            configuration for "${environment}" has the correct sessionSecret.
          `);
        }

        this.setProps({
          cookie: encrypt('{}', sessionSecret),
          didChange: true
        });
      });
    } else {
      this.setProps({
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
