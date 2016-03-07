import { Model } from '../../../../index';

class Post extends Model {
  static attributes = {
    body: {
      type: 'text'
    },

    isPublic: {
      type: 'boolean',
      defaultValue: false
    }
  };

  static hasOne = {
    user: {
      model: 'user',
      reverse: 'posts'
    }
  };
}

export default Post;
