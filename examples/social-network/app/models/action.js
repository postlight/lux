import { Model, DataTypes } from '../../../../index';

class Action extends Model {
  static attributes = {
    trackableId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    trackableType: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userId: {
      type: DataTypes.INTEGER
    }
  };

  static indices = [
    {
      name: 'actions_non_unique',
      unique: false,
      fields: [
        'trackableId',
        'trackableType',
        'userId',
        'createdAt',
        'updatedAt'
      ]
    }
  ];

  static hooks = {
    async afterCreate(action) {
      await action.notifyOwner();
    },

    async afterDestroy(action) {
      await action.destroyNotification();
    }
  };

  static classMethods = {
    associate(db) {
      this.hasOne(db.Notification);

      this.belongsTo(db.User);
    }
  };

  static instanceMethods = {
    async getOwner(options = {}) {
      try {
        const trackable = await this.getTrackable();

        if (trackable) {
          const trackableType = this.get('trackableType');

          switch (trackableType) {
            case 'Like':
              const likeable = await trackable.getLikeable();

              if (likeable) {
                return await likeable.getUser(options);
              }

            case 'Comment':
              const commentable = await trackable.getCommentable();

              if (commentable) {
                return await commentable.getUser(options);
              }

            default:
              if (typeof trackable.getUser === 'function') {
                return await trackable.getUser(options);
              }
          }
        }
      } catch (err) {
        console.error(err);
      }
    },

    async getTrackable(options = {}) {
      try {
        let trackableType = this.get('trackableType');

        trackableType = this.sequelize.models[trackableType];

        if (trackableType) {
          const trackableId = this.get('trackableId');

          return await trackableType.findById(trackableId, options);
        }
      } catch (err) {
        console.error(err);
      }
    },

    async notifyOwner() {
      try {
        const owner = await this.getOwner({
          attributes: ['id']
        });

        if (owner && this.get('userId') !== owner.get('id')) {
          const { Notification } = this.sequelize.models;

          await Notification.create({
            userId: owner.get('id'),
            actionId: this.get('id')
          });
        }
      } catch (err) {
        console.error(err);
      }
    },

    async destroyNotification() {
      try {
        const notification = await this.getNotification();

        if (notification) {
          await notification.destroy();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };
}

export default Action;
