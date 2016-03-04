import { Controller } from '../../../../index';

import authenticate from '../middleware/authenticate';

class ApplicationController extends Controller {
  beforeAction = [
    authenticate
  ];
}

export default ApplicationController;
