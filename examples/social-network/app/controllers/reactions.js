import { Controller } from 'lux-framework';

class ReactionsController extends Controller {
  params = [
    'type',
    'user',
    'post',
    'comment'
  ];
}

export default ReactionsController;
