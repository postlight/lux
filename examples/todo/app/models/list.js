import { Model } from 'lux-framework';

class List extends Model {
  static hasMany = {
    tasks: {
      inverse: 'list'
    }
  };
}

export default List;
