import { Model } from 'lux-framework';

import track from 'app/utils/track';

class Reaction extends Model {
  static belongsTo = {
    comment: {
      inverse: 'reactions'
    },

    post: {
      inverse: 'reactions'
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
