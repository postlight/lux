import { Model } from 'lux-framework';

import track from 'app/utils/track';

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
    },

    tags: {
      inverse: 'posts',
      through: 'categorization'
    }
  };

  static hooks = {
    async afterCreate(post, trx) {
      await track(post, trx);
    }
  };
}

export default Post;
