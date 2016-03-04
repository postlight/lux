import { Serializer } from '../../../../index';

class NotificationsSerializer extends Serializer {
  attributes = [
    'unread',
    'createdAt',
    'updatedAt'
  ];

  hasOne = [
    'action',
    'user'
  ];
}

export default NotificationsSerializer;
