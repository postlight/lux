import { Model } from 'LUX_LOCAL'

class Image extends Model {
  static belongsTo = {
    post: {
      inverse: 'image'
    }
  };
}

export default Image
