import { Controller } from 'lux-framework'

class PostsController extends Controller {
  params = [
    'user',
    'body',
    'title',
    'image',
    'isPublic'
  ];

  index(req, res) {
    return super.index(req, res).isPublic()
  }
}

export default PostsController
