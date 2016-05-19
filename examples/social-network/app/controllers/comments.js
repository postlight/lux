import { Controller } from 'lux-framework';

import setUser from '../middleware/set-user';

class CommentsController extends Controller {
  params = [
    'message',
    'edited'
  ];

  beforeAction = [
    setUser
  ];
}

export default CommentsController;
