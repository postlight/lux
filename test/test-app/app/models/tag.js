import { Model } from '../../../../dist';

class Tag extends Model {
  static belongsTo = {
    post: {
      inverse: 'tag'
    }
  };
}

export default Tag;
