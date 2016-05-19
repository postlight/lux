import { Controller, action } from 'lux-framework';

import User from '../models/user';

class UsersController extends Controller {
  params = [
    'name',
    'email',
    'password'
  ];

  @action
  async login(req, res) {
    const {
      session,

      params: {
        data: {
          attributes: {
            email,
            password
          }
        }
      }
    } = req;

    const user = await User.authenticate(email, password);

    if (user) {
      session.set('currentUserId', user.id);
    }

    return {
      data: user
    };
  }

  @action
  logout(req, res) {
    const {
      session,

      session: {
        isAuthenticated
      }
    } = req;

    if (isAuthenticated) {
      session.delete('currentUserId');
    }

    return isAuthenticated;
  }
}

export default UsersController;
