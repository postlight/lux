import { Model, DataTypes } from '../../../../index';

class Task extends Model {
  static attributes = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New Task'
    },

    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    dueDate: {
      type: DataTypes.DATE
    },

    taskListId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  };

  static indices = [
    {
      unique: false,
      fields: [
        'name',
        'completed',
        'dueDate',
        'taskListId'
      ]
    }
  ];

  static classMethods = {
    associate(db) {
      this.belongsTo(db.TaskList);
    }
  };
}

export default Task;
