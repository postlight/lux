import Promise from 'bluebird';
import { camelize, dasherize, pluralize, singularize } from 'inflection';

import Collection from './collection';
import { sql } from '../logger';

import initHooks from './utils/init-hooks';
import initProps from './utils/init-props';
import getOffset from './utils/get-offset';
import formatSelect from './utils/format-select';
import fetchHasMany from './utils/fetch-has-many';

import pick from '../../utils/pick';
import omit from '../../utils/omit';
import underscore from '../../utils/underscore';

const { isArray } = Array;
const { assign, entries, keys } = Object;

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
  static primaryKey = 'id';
  static validations = {};
  static defaultPerPage = 25;

  constructor(props = {}) {
    const {
      constructor: {
        attributeNames,
        relationshipNames
      }
    } = this;

    return assign(
      this,
      pick(props, ...attributeNames, ...relationshipNames)
    );
  }

  get modelName() {
    return this.constructor.modelName;
  }

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

  async save() {
    return this;
  }

  async update(props = {}) {
    const {
      constructor: {
        primaryKey,
        table,

        store: {
          debug
        },

        hooks: {
          afterUpdate,
          afterSave,
          beforeUpdate,
          beforeSave
        }
      }
    } = this;

    assign(this, {
      ...props,
      updatedAt: new Date()
    });

    await beforeUpdate(this);
    await beforeSave(this);

    const query = table()
      .where({ [primaryKey]: this[primaryKey] })
      .update(omit(this.format('database'), primaryKey));

    if (debug) {
      const { constructor: { logger } } = this;

      query.on('query', () => {
        setImmediate(() => logger.log(sql`${query.toString()}`));
      });
    }

    await query;

    await afterUpdate(this);
    await afterSave(this);

    return this;
  }

  async destroy() {
    const {
      constructor: {
        primaryKey,
        table,

        store: {
          debug
        },

        hooks: {
          afterDestroy,
          beforeDestroy
        }
      }
    } = this;

    await beforeDestroy(this);

    const query = table()
      .where({ [primaryKey]: this[primaryKey] })
      .del();

    if (debug) {
      const { constructor: { logger } } = this;

      query.on('query', () => {
        setImmediate(() => logger.log(sql`${query.toString()}`));
      });
    }

    await query;

    await afterDestroy(this);

    return this;
  }

  format(dest) {
    const { constructor: { attributes } } = this;

    switch (dest) {
      case 'database':
        return entries(attributes)
          .reduce((hash, [key, { columnName }]) => {
            return {
              ...hash,
              [columnName]: this[key]
            };
          }, {});

      case 'jsonapi':
        return entries(attributes)
          .reduce((hash, [key, { docName }]) => {
            return {
              ...hash,
              [docName]: this[key]
            };
          }, {});
    }
  }

  static async create(props = {}) {
    const {
      primaryKey,
      table,

      store: {
        debug
      },

      hooks: {
        afterCreate,
        afterSave,
        beforeCreate,
        beforeSave
      }
    } = this;

    const datetime = new Date();
    const instance = new this({
      ...props,
      createdAt: datetime,
      updatedAt: datetime
    });

    await beforeCreate(instance);
    await beforeSave(instance);

    const query = table()
      .returning(primaryKey)
      .insert(omit(instance.format('database'), primaryKey));

    if (debug) {
      const { logger } = this;

      query.on('query', () => {
        setImmediate(() => logger.log(sql`${query.toString()}`));
      });
    }

    assign(instance, {
      id: (await query)[0]
    });

    await afterCreate(instance);
    await afterSave(instance);

    return instance;
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
    const { hooks } = this;
    const { logger } = store;

    const attributes = entries(await table().columnInfo())
      .reduce((hash, [columnName, value]) => {
        return {
          ...hash,
          [camelize(columnName, true)]: {
            ...value,
            columnName,
            docName: dasherize(columnName)
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

    assign(this, {
      store,
      table,
      logger,
      attributes,
      belongsTo,
      hasOne,
      hasMany
    });

    initHooks(this, hooks);

    initProps(this.prototype, attributes, {
      ...belongsTo,
      ...hasOne,
      ...hasMany
    });

    return this;
  }
}

export default Model;
