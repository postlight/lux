import { Model, DataTypes } from '../../../../index';
import { promisifyAll } from 'bluebird';
import bcrypt from 'bcryptjs';

promisifyAll(bcrypt);

class User extends Model {
  static attributes = {
     name: {
       type: DataTypes.STRING,
       allowNull: false
     },

     email: {
       type: DataTypes.STRING,
       unique: true,
       allowNull: false
     },

     passwordSalt: {
       type: DataTypes.STRING,
       defaultValue: ''
     },

     passwordHash: {
       type: DataTypes.STRING,
       defaultValue: ''
     }
  };

  static indices = [
    {
      unique: true,
      fields: [
        'email'
      ]
    },

    {
      name: 'users_non_unique',
      unique: false,
      fields: [
        'createdAt',
        'updatedAt'
      ]
    }
  ];

  static hooks = {
    async beforeCreate(user) {

    }
  };

  static classMethods = {
    associate(db) {
      this.hasMany(db.Action);

      this.hasMany(db.Comment);

      this.hasMany(db.Like);

      this.hasMany(db.Post);

      this.hasMany(db.Notification);

      this.belongsToMany(db.User, {
        as: 'followees',
        through: db.Friendship,
        foreignKey: 'userId'
      });

      this.belongsToMany(db.User, {
        as: 'followers',
        through: db.Friendship,
        foreignKey: 'followerId'
      });
    },

    async authenticate(email, password) {
      const user = await this.findOne({
        where: {
          email
        }
      });

      if (user) {
        const hash = user.get('passwordHash');

        if (await bcrypt.compareAsync(password, hash)) {
          return user;
        }
      }

      return false;
    }
  };
}

export default User;
