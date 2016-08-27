import { Controller } from 'LUX_LOCAL';

class PostsController extends Controller {
  params = [
    'body',
    'title',
    'author',
    'isPublic'
  ];

  beforeAction = [
    function setControllerHeader(req, res) {
      res.setHeader('X-Controller', 'Posts');
    }
  ];

  index(req, res) {
    return super.index(req, res).isPublic();
  }

  show(req, res) {
    return super.show(req, res).isPublic();
  }
}

export default PostsController;
