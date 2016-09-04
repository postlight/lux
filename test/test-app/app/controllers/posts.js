import { Controller } from 'LUX_LOCAL';

class PostsController extends Controller {
  params = [
    'user',
    'body',
    'title',
    'isPublic'
  ];
}

export default PostsController;
