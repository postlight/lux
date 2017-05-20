import { Model } from 'LUX_LOCAL'

import track from '../utils/track'

class Comment extends Model {
  static belongsTo = {
    post: {
      inverse: 'comments'
    },

    user: {
      inverse: 'comments'
    }
  };

  static hasMany = {
    actions: {
      inverse: 'trackable'
    },

    reactions: {
      inverse: 'comment'
    }
  };

  static hooks = {
    async afterCreate(comment, trx) {
      await track(comment, trx)
    }
  };
}

export default Comment
