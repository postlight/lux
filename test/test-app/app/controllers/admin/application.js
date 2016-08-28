import ApplicationController from 'app/controllers/application';

class AdminApplicationController extends ApplicationController {
  beforeAction = [
    function setNamespaceHeader(req, res) {
      res.setHeader('X-Namespace', 'admin');
    }
  ];
}

export default AdminApplicationController;
