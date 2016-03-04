import { Controller } from '../../../../index';

import setUser from '../middleware/set-user';

class CommentsController extends Controller {
  params = [
    'message',
    'commentableId',
    'commentableType'
  ];

  beforeAction = [
    setUser
  ];
}

export default CommentsController;
