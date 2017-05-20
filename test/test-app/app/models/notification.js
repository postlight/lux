import { Model } from 'LUX_LOCAL'

class Notification extends Model {
  static belongsTo = {
    recipient: {
      model: 'user',
      inverse: 'notifications'
    }
  };
}

export default Notification
