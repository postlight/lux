import { Controller } from 'lux-framework';

import setUser from '../middleware/set-user';

class PostsController extends Controller {
  params = [
    'body',
    'title',
    'isPublic'
  ];

  beforeAction = [
    setUser
  ];
}

export default PostsController;
