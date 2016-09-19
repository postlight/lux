import { Model } from 'LUX_LOCAL';

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
    },

    tags: {
      inverse: 'posts',
      through: 'categorization'
    }
  };

  static hooks = {
    async afterCreate(post) {
      await track(post);
    }
  };

  static scopes = {
    isPublic() {
      return this.where({
        isPublic: true
      });
    }
  };
}

export default Post;
