import { Model, DataTypes } from '../../index';

class Post extends Model {
  static attributes = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New Post'
    },

    body: {
      type: DataTypes.TEXT
    },

    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  };
}

export default Post;
