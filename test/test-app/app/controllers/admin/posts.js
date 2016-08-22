import { Controller } from 'LUX_LOCAL';

class AdminPostsController extends Controller {
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
}

export default AdminPostsController;
