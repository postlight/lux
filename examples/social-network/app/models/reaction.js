import { Model } from 'lux-framework';

import Comment from './comment';
import Notification from './notification';
import Post from './post';
import User from './user';

import track from '../utils/track';

class Reaction extends Model {
  static belongsTo = {
    comment: {
      inverse: 'reactions'
    },

    post: {
      inverse: 'reaction'
    },

    user: {
      inverse: 'reactions'
    }
  };

  static hooks = {
    beforeSave(reaction) {
      const {
        commentId,
        postId
      } = reaction;

      if (!commentId && !postId) {
        throw new Error('Reactions must have a reactable (Post or Comment).');
      }
    },

    async afterCreate(reaction) {
      await track(reaction);
    }
  };
}

export default Reaction;
