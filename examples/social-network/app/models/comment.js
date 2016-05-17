import { Model } from 'lux-framework';

import Notification from './notification';
import Post from './post';
import User from './user';

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
      try {
        const {
          postId,
          userId
        } = comment;

        const [
          { name: userName },
          { userId: recipientId }
        ] = await Promise.all([
          User.find(userId, { select: ['name'] }),
          Post.find(postId, { select: ['userId'] })
        ]);

        await Notification.create({
          recipientId,
          message: `${userName} commented on your post!`
        });
      } catch (err) {
        // Ignore Error...
      }
    }
  };
}

export default Comment;
