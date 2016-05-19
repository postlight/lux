import { Controller } from 'lux-framework';

import authenticate from '../middleware/authenticate';

class ApplicationController extends Controller {
  beforeAction = [
    authenticate
  ];
}

export default ApplicationController;
