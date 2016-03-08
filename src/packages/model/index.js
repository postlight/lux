import Promise from 'bluebird';

const { assign } = Object;

class Model {
  static attributes = {
    id: {
      type: 'serial',
      key: true
    },

    createdAt: {
      type: 'date',
      time: true,
      mapsTo: 'created_at'
    },

    updatedAt: {
      type: 'date',
      time: true,
      mapsTo: 'updated_at'
    }
  };

  static hasOne = {};

  static hasMany = {};

  static hooks = {};

  update(params = {}) {
    return new Promise((resolve, reject) => {
      assign(this, params, {
        updatedAt: new Date()
      });

      this.save(err => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  destroy() {
    return new Promise((resolve, reject) => {
      this.remove(err => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export adapter from './utils/adapter';

export default Model;
