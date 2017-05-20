import { Serializer } from 'LUX_LOCAL'

class NotificationsSerializer extends Serializer {
  attributes = [
    'unread',
    'message',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'recipient'
  ];
}

export default NotificationsSerializer
