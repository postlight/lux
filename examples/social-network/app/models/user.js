import { Model } from 'lux-framework';

import {
  encryptPassword,
  comparePassword
} from 'app/utils/password';

class User extends Model {
  static hasMany = {
    comments: {
      inverse: 'user'
    },

    notifications: {
      inverse: 'recipient'
    },

    posts: {
      inverse: 'user'
    },

    followees: {
      model: 'user',
      inverse: 'followers',
      through: 'friendship'
    },

    followers: {
      model: 'user',
      inverse: 'followees',
      through: 'friendship'
    },

    reactions: {
      inverse: 'user'
    }
  };

  static hooks = {
    async beforeSave(user) {
      const { id, password, dirtyAttributes } = user;

      if ((typeof id !== 'number') && password || dirtyAttributes.has('password')) {

        Object.assign(user, {
          password: encryptPassword(password)
        });
      }
    }
  };

  static scopes = {
    findByEmail(email) {
      return this.first().where({
        email
      });
    }
  };

  static validates = {
    password(password = '') {
      return password.length >= 8;
    }
  };

  authenticate(password) {
    return comparePassword(password, this.password);
  }
}

export default User;
