import { Model } from 'lux-framework';

import Comment from './comment';
import Notification from './notification';
import Post from './post';
import User from './user';

class Reaction extends Model {
  static belongsTo = {
    comment: {
      inverse: 'reaction'
    },

    post: {
      inverse: 'reaction'
    },

    user: {
      inverse: 'reaction'
    }
  };

  static hooks = {
    beforeSave(reaction) {
      const {
        commentId,
        postId
      } = reaction;

      if (!commentId && postId) {
        throw new Error('Reactions must have a reactable (Post or Comment).');
      }
    },

    async afterCreate(reaction) {
      try {
        let reactableId;
        let reactableModel = Post;

        const {
          commentId,
          postId,
          userId
        } = reaction;

        if (!postId) {
          reactableId = commentId;
          reactableModel = Comment;
        } else {
          reactableId = postId;
        }

        const [
          { name: userName },
          { userId: recipientId }
        ] = await Promise.all([
          User.find(userId, { select: ['name'] }),
          reactableModel.find(reactableId, { select: ['userId'] })
        ]);

        await Notification.create({
          recipientId,
          message: `${userName} reacted with ${type} to your ` +
            `${reactableModel.name.toLowerCase()}!`
        });
      } catch (err) {
        // Ignore Error...
      }
    }
  };
}

export default Reaction;
