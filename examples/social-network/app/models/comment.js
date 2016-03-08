import { Model } from '../../../../index';

class Comment extends Model {
  static attributes = {
    edited: {
      type: 'boolean',
      defaultValue: false
    },

    message: {
      type: 'text'
    },

    commentableId: {
      type: 'integer',
      size: 4
    },

    commentableType: {
      type: 'text'
    }
  };

  static hasOne = {
    user: {
      model: 'user',
      reverse: 'comments'
    }
  };
}

export default Comment;
