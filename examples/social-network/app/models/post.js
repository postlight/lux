import { Model } from 'lux-framework';

class Post extends Model {
  static belongsTo = {
    user: {
      inverse: 'post'
    }
  };

  static hasMany = {
    comments: {
      inverse: 'post'
    },

    reactions: {
      inverse: 'post'
    }
  };
}

export default Post;
