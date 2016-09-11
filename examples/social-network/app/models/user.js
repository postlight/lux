import { Model } from 'lux-framework';

import { hashPassword, comparePassword } from 'app/utils/password';

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
      if (user.isNew || user.dirtyAttributes.has('password')) {
        user.password = await hashPassword(user.password);
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

  static async authenticate(email, password) {
    const user = await this.findByEmail(email);

    if (user) {
      const isAuthenticated = await comparePassword(password, user.password);

      return isAuthenticated && user;
    }
  }
}

export default User;
