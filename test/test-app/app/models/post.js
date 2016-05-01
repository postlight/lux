import { Model } from '../../../../dist';

class Post extends Model {
  static belongsTo = {
    author: {
      inverse: 'posts'
    }
  };

  static hooks = {
    async afterCreate(post) {

    }
  };
}

export default Post;
