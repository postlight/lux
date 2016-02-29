import DataTypes from 'sequelize/lib/data-types';

import omit from '../../utils/omit';

const { entries } = Object;
const { isArray } = Array;
const { min, max } = Math;

function normalizePage(num = 1) {
  return max(parseInt(num, 10) - 1 , 0);
}

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

      entries(where)
        .forEach(entry => {
          const [key, value] = entry;

          if (isArray(value)) {
            where[key] = {
              in: value
            };
          }
        });

      return await this.findAll({
        where,
        order,
        limit,
        offset,
        include,
        attributes
      });
    }
  }

  static instanceMethods = {

  }
}

export DataTypes from 'sequelize/lib/data-types';

export default Model;
