import { Controller } from 'LUX_LOCAL';

class AuthorsController extends Controller {
  params = [
    'name'
  ];

  beforeAction = [
    function setControllerHeader(req, res) {
      res.setHeader('X-Controller', 'Authors');
    }
  ];
}

export default AuthorsController;
