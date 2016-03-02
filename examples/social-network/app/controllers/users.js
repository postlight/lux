import { Controller, action } from '../../../../index';

class UsersController extends Controller {
  params = [
    'name',
    'email',
    'password'
  ];

  @action
  async login(req, res) {
    const { session } = req;
    const { email, password } = req.params;
    const user = await this.model.authenticate(email, password);

    if (user) {
      session.set('currentUserId', user.get('id'));
    }

    return user;
  }

  @action
  logout(req, res) {
    const { session } = req;
    const { isAuthenticated } = session;

    if (isAuthenticated) {
      session.delete('currentUserId');
    }

    return isAuthenticated;
  }
}

export default UsersController;
