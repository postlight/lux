import PostsController from 'app/controllers/posts';

class AdminPostsController extends PostsController {
  index(req, res) {
    return super.index(req, res).unscope('isPublic');
  }

  show(req, res) {
    return super.show(req, res).unscope('isPublic');
  }
}

export default AdminPostsController;
