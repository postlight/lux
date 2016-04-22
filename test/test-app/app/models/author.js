import { Model } from '../../../../dist';

class Author extends Model {
  static attributes = {
    name: {
      type: 'text',
      defaultValue: 'New Author'
    }
  };
}

export default Author;
