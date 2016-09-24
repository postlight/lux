import { Model } from 'lux-framework';

import Comment from 'app/models/comment';
import Notification from 'app/models/notification';
import Post from 'app/models/post';
import Reaction from 'app/models/reaction';
import User from 'app/models/user';

const createMessageTemplate = resourceType => (name, reactionType) => (
  `${name} reacted to your ${resourceType} with ${reactionType}`
);

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

    if (trackableType === 'Comment') {
      const trackable = await Comment
        .first()
        .select('postId', 'userId')
        .where({ id: trackableId });

      if (trackable) {
        const [user, post] = await Promise.all([
          User
            .first()
            .select('name')
            .where({ id: trackable.userId }),
          Post
            .first()
            .select('userId')
            .where({ id: trackable.postId })
        ]);

        if (user && post) {
          await Notification.create({
            message: `${user.name} commented on your post!`,
            recipientId: post.userId
          });
        }
      }
    } else if (trackableType === 'Reaction') {
      let reactableId;
      let createMessage;
      let ReactableModel;

      const reaction = await Reaction
        .first()
        .where({ id: trackableId });

      if (reaction) {
        if (!reaction.postId) {
          ReactableModel = Comment;
          createMessage = createMessageTemplate('comment');
          reactableId = reaction.commentId;
        } else {
          ReactableModel = Post;
          createMessage = createMessageTemplate('post');
          reactableId = reaction.postId;
        }

        const [user, reactable] = await Promise.all([
          User
            .first()
            .select('name')
            .where({ id: reaction.userId }),
          ReactableModel
            .first()
            .select('userId')
            .where({ id: reactableId })
        ]);

        if (user && reactable) {
          await Notification.create({
            message: createMessage(user.name, reaction.type),
            recipientId: reactable.userId
          });
        }
      }
    }
  }
}

export default Action;
