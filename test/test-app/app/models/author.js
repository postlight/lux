import { Model } from '../../../../dist';

class Author extends Model {
  static hasMany = {
    posts: {
      inverse: 'author'
    }
  };
}

export default Author;
