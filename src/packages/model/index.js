import Promise from 'bluebird';
import { camelize, dasherize, pluralize, singularize } from 'inflection';

import Collection from './collection';
import { sql } from '../logger';

import initProps from './utils/init-props';
import getOffset from './utils/get-offset';
import formatSelect from './utils/format-select';
import fetchHasMany from './utils/fetch-has-many';

import pick from '../../utils/pick';
import underscore from '../../utils/underscore';

const { isArray } = Array;
const { keys, assign, entries } = Object;

class Model {
  static table;
  static store;
  static logger;
  static serializer;
  static attributes;
  static belongsTo;
  static hasOne;
  static hasMany;

  static _tableName;

  static hooks = {};
  static validations = {};
  static defaultPerPage = 25;

  static get modelName() {
    return dasherize(underscore(this.name));
  }

  static get tableName() {
    return this._tableName ? this._tableName : pluralize(underscore(this.name));
  }

  static set tableName(value) {
    this._tableName = value;
  }

  static get relationships() {
    const {
      belongsTo,
      hasOne,
      hasMany
    } = this;

    return {
      ...belongsTo,
      ...hasOne,
      ...hasMany
    };
  }

  static get attributeNames() {
    return keys(this.attributes);
  }

  static get relationshipNames() {
    return keys(this.relationships);
  }

  get modelName() {
    return this.constructor.modelName;
  }

  constructor(props = {}) {
    const {
      constructor: {
        attributeNames,
        relationshipNames
      }
    } = this;

    assign(this, pick(props, ...attributeNames, ...relationshipNames));
    return this;
  }

  async save() {
    return this;
  }

  async update(params = {}) {
    return await this.save();
  }

  async destroy() {
    return;
  }

  static create(props = {}) {
    return new this(props).save();
  }

  static async count(where = {}) {
    const { table, store: { debug } } = this;
    const query = table().count('* AS count').where(where);

    if (debug) {
      const { logger } = this;

      query.on('query', () => {
        setImmediate(() => logger.log(sql`${query.toString()}`));
      });
    }

    return (await query)[0].count;
  }

  static async find(id, options = {}) {
    return await this.findOne({
      ...options,
      where: {
        [`${this.tableName}.id`]: id
      }
    });
  }

  static async findAll(options = {}) {
    const {
      table,
      tableName,
      store: {
        debug
      }
    } = this;

    let {
      page,
      order,
      limit,
      where,
      select,
      include = []
    } = options;

    if (!limit) {
      limit = this.defaultPerPage;
    }

    select = formatSelect(this, select);

    include = include
      .map(included => {
        let name, attrs;

        if (typeof included === 'string') {
          name = included;
        } else if (typeof included === 'object') {
          [[name, attrs]] = entries(included);
        }

        included = this.getRelationship(name);

        if (!included) {
          return null;
        }

        if (!attrs) {
          attrs = included.model.attributeNames;
        }

        return {
          name,
          attrs,
          relationship: included
        };
      })
      .filter(included => included);

    let related = include.filter(({ relationship: { type } }) => {
      return type === 'hasMany';
    });

    let records = table()
      .select(select)
      .where(where)
      .limit(limit)
      .offset(getOffset(page, limit));

    if (order) {
      if (typeof order === 'string') {
        const direction = order.charAt(0) === '-' ? 'desc' : 'asc';

        records = records.orderBy(
          `${tableName}.` + this.getColumnName(
            direction === 'desc' ? order.substr(1) : order
          ) || 'created_at',
          direction
        );
      } else if (isArray(order)) {
        records = records.orderBy(order[0], order[1]);
      }
    }

    include
      .filter(({ relationship: { type } }) => type !== 'hasMany')
      .forEach(({ name, attrs, relationship: { type, model, foreignKey } }) => {
        records = records.select(
          ...formatSelect(model, attrs, `${name}.`)
        );

        if (type === 'belongsTo') {
          records = records.leftOuterJoin(
            model.tableName,
            `${tableName}.${foreignKey}`,
            '=',
            `${model.tableName}.id`
          );
        } else if (type === 'hasOne') {
          records = records.leftOuterJoin(
            model.tableName,
            `${tableName}.id`,
            '=',
            `${model.tableName}.${foreignKey}`
          );
        }
      });

    if (debug) {
      const { logger } = this;

      records.on('query', () => {
        setImmediate(() => logger.log(sql`${records.toString()}`));
      });
    }

    [records, related] = await Promise.all([
      records,
      fetchHasMany(this, related)
    ]);

    return new Collection({
      records,
      related,
      model: this
    });
  }

  static async findOne(options = {}) {
    const [record] = await this.findAll({
      ...options,
      limit: 1
    });

    return record ? record : null;
  }

  static getColumn(key) {
    const { attributes: { [key]: column } } = this;

    return column;
  }

  static getColumnName(key) {
    const column = this.getColumn(key);

    if (column) {
      return column.columnName;
    }
  }

  static getRelationship(key) {
    const {
      relationships: {
        [key]: relationship
      }
    } = this;

    return relationship;
  }

  static async initialize(store, table) {
    const { logger } = store;

    const attributes = entries(await table().columnInfo())
      .reduce((hash, [columnName, value]) => {
        return {
          ...hash,
          [camelize(columnName, true)]: {
            ...value,
            columnName
          }
        };
      }, {});

    const belongsTo = entries(this.belongsTo || {})
      .reduce((hash, [relatedName, value]) => {
        return {
          ...hash,

          [relatedName]: {
            foreignKey: `${underscore(relatedName)}_id`,

            ...value,

            type: 'belongsTo',
            model: store.modelFor(value.model || relatedName)
          }
        };
      }, {});

    const hasOne = entries(this.hasOne || {})
      .reduce((hash, [relatedName, value]) => {
        return {
          foreignKey: `${underscore(value.inverse)}_id`,

          ...hash,

          [relatedName]: {

            ...value,

            type: 'hasOne',
            model: store.modelFor(value.model || relatedName)
          }
        };
      }, {});

    const hasMany = entries(this.hasMany || {})
      .reduce((hash, [relatedName, value]) => {
        return {
          ...hash,

          [relatedName]: {
            foreignKey: `${underscore(value.inverse)}_id`,

            ...value,

            type: 'hasMany',
            model: store.modelFor(value.model || singularize(relatedName))
          }
        };
      }, {});

    initProps(this.prototype, attributes, {
      ...belongsTo,
      ...hasOne,
      ...hasMany
    });

    return assign(this, {
      store,
      table,
      logger,
      attributes,
      belongsTo,
      hasOne,
      hasMany
    });
  }
}

export default Model;
