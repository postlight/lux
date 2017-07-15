import { Model } from 'lux-framework'

class Image extends Model {
  static belongsTo = {
    post: {
      inverse: 'image'
    }
  };
}

export default Image
