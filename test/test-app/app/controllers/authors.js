import { Controller } from '../../../../dist';

class AuthorsController extends Controller {
  params = [
    'name'
  ];

  beforeAction = [
    function (req, res) {
      res.setHeader('X-Controller', 'Authors');
    }
  ];
}

export default AuthorsController;
