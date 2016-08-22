import { Controller } from 'LUX_LOCAL';

class AdminApplicationController extends Controller {
  beforeAction = [
    function authenticate({ logger }) {
      logger.info('Hello from the Admin Namespace!');
    }
  ];
}

export default AdminApplicationController;
