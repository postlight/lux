import PostsController from '../posts';

class AdminPostsController extends PostsController {
  index(req, res) {
    return super.index(req, res).unscope('isPublic');
  }
}

export default AdminPostsController;
