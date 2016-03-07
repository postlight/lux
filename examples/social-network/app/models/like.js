import { Model } from '../../../../index';

class Like extends Model {
  static attributes = {
    likeableId: {
      type: 'integer',
      size: 4
    },

    likeableType: {
      type: 'text'
    }
  };

  static hasOne = {
    user: {
      model: 'user',
      reverse: 'likes'
    }
  };
}

export default Like;
