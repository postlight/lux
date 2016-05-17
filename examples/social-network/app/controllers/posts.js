import { Controller } from 'lux-framework';

class PostsController extends Controller {
  params = [
    'body',
    'isPublic'
  ];
}

export default PostsController;
