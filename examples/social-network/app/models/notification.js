import { Model } from '../../../../index';

class Notification extends Model {
  static attributes = {
    unread: {
      type: 'boolean',
      defaultValue: false
    }
  };

  static hasOne = {
    action: {
      model: 'action',
      reverse: 'notification'
    },

    user: {
      model: 'user',
      reverse: 'notifications'
    }
  };
}

export default Notification;
