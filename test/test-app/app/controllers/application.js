import { Controller } from 'LUX_LOCAL';

class ApplicationController extends Controller {
  beforeAction = [
    function logDefaultParams({ logger, defaultParams }) {
      logger.debug(JSON.stringify(defaultParams, null, 2));
    },

    function setPoweredByHeader(req, res) {
      res.setHeader('X-Powered-By', 'Lux');
    }
  ];
}

export default ApplicationController;
