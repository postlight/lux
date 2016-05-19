import { Model } from 'lux-framework';

import track from '../utils/track';

class Post extends Model {
  static belongsTo = {
    user: {
      inverse: 'posts'
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

  static hooks = {
    async afterCreate(post) {
      await track(post);
    }
  };
}

export default Post;
