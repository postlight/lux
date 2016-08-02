import { Controller } from 'lux-framework';

class PostsController extends Controller {
  params = [
    'user',
    'body',
    'title',
    'isPublic'
  ];
}

export default PostsController;
