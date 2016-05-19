import { Model } from 'lux-framework';

import track from '../utils/track';

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
    reactions: {
      inverse: 'comment'
    }
  };

  static hooks = {
    async afterCreate(comment) {
      await track(comment);
    }
  };
}

export default Comment;
