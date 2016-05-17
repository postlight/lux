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

    reactions: {
      inverse: 'user'
    }
  };

  static hooks = {
    async beforeSave(user) {
      const { id, password, dirtyAttributes } = user;

      if (!id && password || dirtyAttributes.has('password')) {
        const salt = generateSalt();

        assign(user, {
          password: encryptPassword(password, salt),
          passwordSalt: salt
        });
      }
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
        password,
        passwordSalt: salt
      } = user;

      if (password === decryptPassword(password, salt)) {
        return user;
      }
    }

    return false;
  }
}

export default User;
