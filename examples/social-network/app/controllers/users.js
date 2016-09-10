import { Controller } from 'lux-framework';

import User from 'app/models/user';

class UsersController extends Controller {
  params = [
    'name',
    'email',
    'password'
  ];

  login({
    params: {
      data: {
        attributes: {
          email,
          password
        }
      }
    }
  }) {
    return User.authenticate(email, password);
  }
}

export default UsersController;
