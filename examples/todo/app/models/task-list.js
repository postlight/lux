import { Model, DataTypes } from '../../../../index';

class TaskList extends Model {
  static attributes = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New Task List'
    }
  };

  static indices = [
    {
      unique: false,
      fields: [
        'name'
      ]
    }
  ];

  static classMethods = {
    associate(db) {
      this.hasMany(db.Task);
    }
  };
}

export default TaskList;
