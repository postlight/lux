import { Controller } from 'LUX_LOCAL';

class ApplicationController extends Controller {
  beforeAction = [
    function setPoweredByHeader(req, res) {
      res.setHeader('X-Powered-By', 'Lux');
    }
  ];
}

export default ApplicationController;
