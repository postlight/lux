import { Controller } from 'lux-framework';

class UsersController extends Controller {
  params = [
    'name',
    'email',
    'password'
  ];
}

export default UsersController;
