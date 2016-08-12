import { Model } from 'lux-framework';

import {
  generateSalt,
  encryptPassword,
  decryptPassword
} from '../utils/password';

const { assign } = Object;

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
        const salt = generateSalt();

        assign(user, {
          password: encryptPassword(password, salt),
          passwordSalt: salt
        });
      }
    }
  };

  static validates = {
    password(password = '') {
      return password.length >= 8;
    }
  };

  static async authenticate(email, password) {
    const user = await this.findOne({
      where: {
        email
      }
    });

    if (user) {
      const {
        password: encrypted,
        passwordSalt: salt
      } = user;

      if (password === decryptPassword(encrypted, salt)) {
        return user;
      }
    }

    return false;
  }
}

export default User;
