import { Model, DataTypes } from '../../../../index';

class Post extends Model {
  static attributes = {
    body: {
      type: DataTypes.TEXT
    },

    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    userId: {
      type: DataTypes.INTEGER
    }
  };

  static indices = [
    {
      name: 'posts_non_unique',
      unique: false,
      fields: [
        'isPublic',
        'userId',
        'createdAt',
        'updatedAt'
      ]
    }
  ];

  static classMethods = {
    associate(db) {
      this.belongsTo(db.User, {
        foreignKey: 'userId'
      });

      this.hasMany(db.Like, {
        scope: {
          likeableType: 'Post'
        },
        foreignKey: 'likeableId'
      });

      this.hasMany(db.Comment, {
        scope: {
          commentableType: 'Post'
        },
        foreignKey: 'commentableId'
      });
    }
  };
}

export default Post;
