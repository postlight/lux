import { Model } from 'lux-framework'

class Tag extends Model {
  static hasMany = {
    posts: {
      inverse: 'tags',
      through: 'categorization'
    }
  };
}

export default Tag
