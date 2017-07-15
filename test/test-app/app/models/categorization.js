import { Model } from 'lux-framework'

class Categorization extends Model {
  static belongsTo = {
    tag: {
      inverse: 'posts'
    },

    post: {
      inverse: 'tags'
    }
  };
}

export default Categorization
