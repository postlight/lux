import { Model } from 'LUX_LOCAL'

import track from '../utils/track'

export const REACTION_TYPES = [
  ':+1:',
  ':-1:',
  ':heart:',
  ':tada:',
  ':laughing:',
  ':disappointed:'
]

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
    async beforeSave({ postId, commentId }) {
      if (!commentId && !postId) {
        throw new Error('Reactions must have a reactable (Post or Comment).')
      }
    },

    async afterCreate(reaction, trx) {
      await track(reaction, trx)
    }
  };
}

export default Reaction
