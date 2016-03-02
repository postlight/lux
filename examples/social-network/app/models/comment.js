import { Model, DataTypes } from '../../../../index';

class Comment extends Model {
  static attributes = {
    edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    message: {
      type: DataTypes.TEXT
    },

    commentableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    commentableType: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER
    }
  };

  static indices = [
    {
      name: 'comments_non_unique',
      unique: false,
      fields: [
        'edited',
        'commentableId',
        'commentableType',
        'userId',
        'createdAt',
        'updatedAt'
      ]
    }
  ];

  static hooks = {
    async afterCreate(comment) {
      await comment.createAction();
    },

    async afterDestroy(comment) {
      await comment.destroyAction();
    }
  };

  static classMethods = {
    associate(db) {
      this.hasOne(db.Action, {
        scope: {
          trackableType: 'Comment'
        },
        foreignKey: 'trackableId'
      });

      this.belongsTo(db.User);
    }
  };

  static instanceMethods = {
    async createAction() {
      try {
        const { Action } = this.sequelize.models;

        await Action.create({
          trackableType: 'Comment',
          trackableId: this.get('id')
        });
      } catch (err) {
        console.error(err);
      }
    },

    async destroyAction() {
      try {
        const action = await this.getAction({
          attributes: ['id']
        });

        if (action) {
          await action.destroy();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
}

export default Comment;
