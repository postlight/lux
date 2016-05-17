import { Controller } from 'lux-framework';

class CommentsController extends Controller {
  params = [
    'message',
    'edited'
  ];
}

export default CommentsController;
