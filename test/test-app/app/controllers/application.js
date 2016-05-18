import { Controller } from '../../../../dist';

class ApplicationController extends Controller {
  beforeAction = [
    function (req, res) {
      res.setHeader('X-Powered-By', 'Lux');
    }
  ];
}

export default ApplicationController;
