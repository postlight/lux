import { Model } from '../../../../dist';

class Post extends Model {
  static belongsTo = {
    author: {
      inverse: 'posts'
    }
  };
}

export default Post;
