import { Controller } from 'LUX_LOCAL';

class PostsController extends Controller {
  params = [
    'user',
    'body',
    'title',
    'image',
    'isPublic'
  ];

  index(req, res) {
    return super.index(req, res).isPublic();
  }
}

export default PostsController;
