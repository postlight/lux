import Base from '../base';

import encrypt from './utils/encrypt';
import decrypt from './utils/decrypt';

class Session extends Base {
  data = {};

  cookie = '';

  didChange = false;

  constructor(props = {}) {
    let { cookie, sessionKey, sessionSecret } = props;

    super({
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
      this.setProps({
        data: JSON.parse(decrypt(value, sessionSecret)),
        cookie: value
      });
    } else {
      this.setProps({
        cookie: encrypt(JSON.stringify(this.data), sessionSecret),
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
