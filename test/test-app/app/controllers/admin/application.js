import ApplicationController from 'app/controllers/application';

class AdminApplicationController extends ApplicationController {
  beforeAction = [
    function authenticate({ logger }) {
      logger.info('Hello from the Admin Namespace!');
    }
  ];
}

export default AdminApplicationController;
