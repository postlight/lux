import { Controller } from 'lux-framework';

class CommentsController extends Controller {
  params = [
    'post',
    'user',
    'edited',
    'message'
  ];
}

export default CommentsController;
