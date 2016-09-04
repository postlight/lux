import { Controller } from 'LUX_LOCAL';

import User from 'app/models/user';

class UsersController extends Controller {
  params = [
    'name',
    'email',
    'password'
  ];

  async login({
    params: {
      data: {
        attributes: {
          email,
          password
        }
      }
    }
  }) {
    const user = await User.findByEmail(email);

    if (user) {
      return user.authenticate(password);
    }
  }
}

export default UsersController;
