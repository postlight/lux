import { Model } from 'lux-framework';

class Notification extends Model {
  static belongsTo = {
    recipient: {
      inverse: 'notification'
    }
  };
}

export default Notification;
