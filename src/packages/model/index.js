import DataTypes from 'sequelize/lib/data-types';

import omit from '../../utils/omit';
import camelizeKeys from '../../utils/camelize-keys';
import normalizePage from './utils/normalize-page';

const { min } = Math;
const { isArray } = Array;

class Model {
  static timestamps = true

  static hooks = {}

  static scopes = {}

  static indices = []

  static attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },

    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },

    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }

  static classMethods = {
    async query(query = {}) {
      const { include, attributes } = query;

      const where = omit(query, ...[
        'sort',
        'page',
        'limit',
        'offset',
        'include',
        'attributes'
      ]);

      const limit = min(query.limit || 50, 50);
      const order = [query.sort || ['createdAt', 'DESC']];
      const offset = normalizePage(query.page) * limit;

      for (let key in where) {
        let value = where[key];

        if (isArray(value)) {
          where[key] = {
            in: value
          };
        }
      }

      return await this.findAll({
        where,
        order,
        limit,
        offset,
        include,
        attributes
      });
    },

    findRecord(id, options) {
      return this.findById(id, options);
    },

    createRecord(params = {}) {
      let { attributes } = params;

      attributes = camelizeKeys(attributes);

      return this.create(attributes);
    }
  }

  static instanceMethods = {
    updateRecord(params = {}) {
      let { attributes } = params;

      attributes = camelizeKeys(attributes);

      return this.update(attributes);
    },

    destroyRecord() {
      return this.destroy();
    }
  }
}

export DataTypes from 'sequelize/lib/data-types';

export default Model;
