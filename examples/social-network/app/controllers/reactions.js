import { Controller } from 'lux-framework';

import setUser from '../middleware/set-user';

class ReactionsController extends Controller {
  params = [
    'type'
  ];

  beforeAction = [
    setUser
  ];
}

export default ReactionsController;
