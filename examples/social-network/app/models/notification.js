import { Model, DataTypes } from '../../../../index';

class Notification extends Model {
  static attributes = {
    unread: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    actionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER
    }
  };

  static indices = [
    {
      unique: true,
      fields: [
        'actionId'
      ]
    },

    {
      unique: false,
      fields: [
        'unread',
        'userId',
        'createdAt',
        'updatedAt'
      ]
    }
  ];

  static classMethods = {
    associate(db) {
      this.belongsTo(db.Action);

      this.belongsTo(db.User);
    }
  };
}

export default Notification;
