import { Model } from '../../../../dist';

class TaskList extends Model {
  static attributes = {
    name: {
      type: 'text',
      defaultValue: 'To Do'
    }
  };

  static hasMany = {
    tasks: {
      model: 'task',
      inverse: 'lists'
    }
  };
}

export default TaskList;
