import { Serializer } from 'lux-framework';

class NotificationsSerializer extends Serializer {
  attributes = [
    'message',
    'unread'
  ];

  hasOne = [
    'recipient'
  ];
}

export default NotificationsSerializer;
