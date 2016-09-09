import { Controller } from 'lux-framework';

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
      return await user.authenticate(password);
    }
  }
}

export default UsersController;
