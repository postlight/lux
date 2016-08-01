import { Serializer } from 'lux-framework';

class NotificationsSerializer extends Serializer {
  attributes = [
    'unread',
    'message'
  ];

  hasOne = [
    'recipient'
  ];
}

export default NotificationsSerializer;
