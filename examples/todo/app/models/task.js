import { Model } from 'lux-framework';

class Task extends Model {
  static belongsTo = {
    list: {
      inverse: 'task'
    }
  };
}

export default Task;
