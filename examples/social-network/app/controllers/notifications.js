import { Controller } from 'lux-framework';

class NotificationsController extends Controller {
  params = [
    'message',
    'unread'
  ];
}

export default NotificationsController;
