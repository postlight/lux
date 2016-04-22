import { Controller } from '../../../../dist';

class PostsController extends Controller {
  params = [
    'title',
    'body',
    'isPublic'
  ];
}

export default PostsController;
