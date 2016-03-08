import { Controller, action } from '../../../../index';

class UsersController extends Controller {
  params = [
    'name',
    'email',
    'password'
  ];

  @action
  async login(req, res) {
    const { store } = this;
    const { params, session } = req;
    const { email, password } = params;
    const user = await store.modelFor('user').authenticate(email, password);

    if (user) {
      session.set('currentUserId', user.id);
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
