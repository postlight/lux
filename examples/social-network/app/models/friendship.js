import { Model } from 'lux-framework';

class Friendship extends Model {
  static belongsTo = {
    follower: {
      model: 'user',
      inverse: 'followers'
    },

    followee: {
      model: 'user',
      inverse: 'followees'
    }
  };
}

export default Friendship;
