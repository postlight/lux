import { Model } from 'lux-framework'

import track from '../utils/track'

class Post extends Model {
  static hasOne = {
    image: {
      inverse: 'post'
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

  static belongsTo = {
    user: {
      inverse: 'posts'
    }
  };

  static hooks = {
    async afterCreate(post, trx) {
      await track(post, trx)
    }
  };

  static scopes = {
    isPublic() {
      return this.where({
        isPublic: true
      })
    }
  };
}

export default Post
