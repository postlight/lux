import { Controller } from 'LUX_LOCAL';

import User from '../models/user';

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
