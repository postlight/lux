import { Model } from 'lux-framework';

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

  static belongsTo = {
    list: {
      model: 'task-list',
      inverse: 'tasks'
    }
  };
}

export default Task;
