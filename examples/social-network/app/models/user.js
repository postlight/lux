import { Model } from '../../../../index';

import {
  generateSalt,
  encryptPassword,
  decryptPassword
} from '../utils/password';

class User extends Model {
  static attributes = {
     name: {
       type: 'text'
     },

     email: {
       type: 'text',
       unique: true
     },

     password: {
       type: 'text'
     },

     passwordSalt: {
       type: 'text'
     }
  };

  static hooks = {
    beforeValidation() {
      if (this.dirtyProperties.includes('password')) {
        this.passwordSalt = generateSalt();
        this.password = encryptPassword(this.password, this.passwordSalt);
      }
    }
  };

  static async authenticate(email, password) {
    const user = await this.oneAsync({
      email
    });

    if (user) {
      if (password === decryptPassword(user.password, user.passwordSalt)) {
        return user;
      }
    }

    return false;
  }
}

export default User;
