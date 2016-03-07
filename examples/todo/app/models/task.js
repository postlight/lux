import { Model } from '../../../../index';

class Task extends Model {
  static attributes = {
    name: {
      type: 'text',
      defaultValue: 'New Task'
    },

    completed: {
      type: 'boolean',
      defaultValue: false
    },

    dueDate: {
      type: 'date',
      time: true
    }
  };

  static hasOne = {
    list: {
      model: 'task-list',
      reverse: 'tasks'
    }
  };
}

export default Task;
