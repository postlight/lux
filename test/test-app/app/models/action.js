import { Model } from 'LUX_LOCAL';

import Comment from './comment';
import Notification from './notification';
import Post from './post';
import Reaction from './reaction';
import User from './user';

/* TODO: Add support for polymorphic relationship to a 'trackable'.
 * https://github.com/postlight/lux/issues/75
 */
class Action extends Model {
  static hooks = {
    async afterCreate(action) {
      await action.notifyOwner();
    }
  };

  async notifyOwner() {
    const { trackableId, trackableType } = this;
    let params;

    if (trackableType === 'Comment') {
      const {
        postId,
        userId
      } = await Comment.find(trackableId, {
        select: ['postId', 'userId']
      });

      const [
        { name: userName },
        { userId: recipientId }
      ] = await Promise.all([
        User.find(userId, { select: ['name'] }),
        Post.find(postId, { select: ['userId'] })
      ]);

      params = {
        recipientId,
        message: `${userName} commented on your post!`
      };
    } else if (trackableType === 'Reaction') {
      let reactableId;
      let reactableModel = Post;

      const {
        commentId,
        postId,
        type,
        userId
      } = await Reaction.find(trackableId, {
        select: [
          'commentId',
          'postId',
          'type',
          'userId'
        ]
      });

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

      params = {
        recipientId,
        message: `${userName} reacted with ${type} to your ` +
          `${reactableModel.name.toLowerCase()}!`
      };
    }

    if (params) {
      return await Notification.create(params);
    }
  }
}

export default Action;
