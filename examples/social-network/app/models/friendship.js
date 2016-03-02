import { Model, DataTypes } from '../../../../index';

class Friendship extends Model {
  static attributes = {
    userId: {
      type: DataTypes.INTEGER
    },

    followerId: {
      type: DataTypes.INTEGER
    }
  };

  static indices = [
    {
      name: 'friendships_non_unique',
      unique: false,
      fields: [
        'userId',
        'followerId',
        'createdAt',
        'updatedAt'
      ]
    }
  ];

  static classMethods = {
    associate(db) {
      this.hasOne(db.User, {
        as: 'followee',
        foreignKey: 'id'
      });

      this.hasOne(db.User, {
        as: 'follower',
        foreignKey: 'id'
      });
    }
  };
}

export default Friendship;
