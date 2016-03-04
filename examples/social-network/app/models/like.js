import { Model, DataTypes } from '../../../../index';

class Like extends Model {
  static attributes = {
    likeableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    likeableType: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER
    }
  };

  static indices = [
    {
      name: 'likes_non_unique',
      unique: false,
      fields: [
        'likeableId',
        'likeableType',
        'userId',
        'createdAt',
        'updatedAt'
      ]
    }
  ];

  static hooks = {
    async afterCreate(like) {
      await like.createAction();
    },

    async afterDestroy(like) {
      await like.destroyAction();
    }
  };

  static classMethods = {
    associate(db) {
      this.hasOne(db.Action, {
        scope: {
          trackableType: 'Like'
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
          trackableType: 'Like',
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

export default Like;
