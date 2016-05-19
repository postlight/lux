import { Model } from 'lux-framework';

class Notification extends Model {
  static belongsTo = {
    recipient: {
      model: 'user',
      inverse: 'notifications'
    }
  };
}

export default Notification;
