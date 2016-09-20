import { Model } from 'LUX_LOCAL';

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
