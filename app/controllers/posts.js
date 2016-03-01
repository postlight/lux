import { Controller, action } from '../../index';

class PostsController extends Controller {
  params = [
    'title',
    'body',
    'isPublic'
  ];
}

export default PostsController;
