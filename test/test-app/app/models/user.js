import { Model } from 'LUX_LOCAL';
import bcrypt from 'bcrypt-as-promised';

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
        user.password = await bcrypt.hash(user.password, 10);
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
      return await bcrypt
        .compare(password, user.password)
        .then(() => user)
        .catch(bcrypt.MISMATCH_ERROR, () => false);
    }
  }
}

export default User;
