import Promise from 'bluebird';
import { dasherize, pluralize } from 'inflection';

import Collection from '../collection';
import { sql } from '../../logger';

import validate from './utils/validate';
import getOffset from './utils/get-offset';
import formatSelect from './utils/format-select';
import fetchHasMany from './utils/fetch-has-many';

import pick from '../../../utils/pick';
import omit from '../../../utils/omit';
import underscore from '../../../utils/underscore';

import readonly from '../../../decorators/readonly';
import nonenumerable from '../../../decorators/nonenumerable';
import nonconfigurable from '../../../decorators/nonconfigurable';

const { isArray } = Array;
const { isFinite } = Number;
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
  static validates = {};
  static primaryKey = 'id';
  static defaultPerPage = 25;

  @nonenumerable
  @nonconfigurable
  initialized = false;

  @readonly
  @nonenumerable
  @nonconfigurable
  initialValues = new Map();

  @readonly
  @nonenumerable
  @nonconfigurable
  dirtyAttributes = new Set();

  constructor(props = {}, initialize = true) {
    const {
      constructor: {
        attributeNames,
        relationshipNames
      }
    } = this;

    assign(
      this,
      pick(props, ...attributeNames, ...relationshipNames)
    );

    this.initialized = initialize;

    return this;
  }

  get isDirty() {
    return Boolean(this.dirtyAttributes.size);
  }

  get modelName() {
    return this.constructor.modelName;
  }

  static get modelName() {
    return dasherize(underscore(this.name));
  }

  static get tableName() {
    return this._tableName ?
      this._tableName : pluralize(underscore(this.name));
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
          afterValidation,
          beforeUpdate,
          beforeSave,
          beforeValidation
        }
      }
    } = this;

    assign(this, props);

    if (this.isDirty) {
      await beforeValidation(this);

      validate(this);

      await afterValidation(this);
      await beforeUpdate(this);
      await beforeSave(this);


      this.updatedAt = new Date();

      const query = table()
        .where({ [primaryKey]: this[primaryKey] })
        .update(this.format('database', ...this.dirtyAttributes));

      if (debug) {
        const { constructor: { logger } } = this;

        query.on('query', () => {
          setImmediate(() => logger.log(sql`${query.toString()}`));
        });
      }

      await query;

      this.dirtyAttributes.clear();

      await afterUpdate(this);
      await afterSave(this);
    }

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
      const {
        constructor: {
          logger
        }
      } = this;

      query.on('query', () => {
        setImmediate(() => logger.log(sql`${query.toString()}`));
      });
    }

    await query;

    await afterDestroy(this);

    return this;
  }

  format(dest, ...only) {
    const {
      constructor: {
        attributes
      }
    } = this;

    switch (dest) {
      case 'database':
        return entries(only.length ? pick(attributes, ...only) : attributes)
          .reduce((hash, [key, { columnName }]) => {
            return {
              ...hash,
              [columnName]: this[key]
            };
          }, {});

      case 'jsonapi':
        return entries(only.length ? pick(attributes, ...only) : attributes)
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
        afterValidation,
        beforeCreate,
        beforeSave,
        beforeValidation
      }
    } = this;

    const datetime = new Date();
    const instance = new this({
      ...props,
      createdAt: datetime,
      updatedAt: datetime
    }, false);

    await beforeValidation(instance);

    validate(instance);

    await afterValidation(instance);
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
      [primaryKey]: (await query)[0]
    });

    instance.initialized = true;

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

    let [{ count }] = await query;
    count = parseInt(count, 10);

    return isFinite(count) ? count : 0;
  }

  static async find(pk, options = {}) {
    const { primaryKey, tableName } = this;

    return await this.findOne({
      ...options,
      where: {
        [`${tableName}.${primaryKey}`]: pk
      }
    });
  }

  static async findAll(options = {}) {
    const {
      table,
      tableName,
      primaryKey,

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
            `${model.tableName}.${model.primaryKey}`
          );
        } else if (type === 'hasOne') {
          records = records.leftOuterJoin(
            model.tableName,
            `${tableName}.${primaryKey}`,
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

  @readonly
  @nonconfigurable
  static getColumn(key) {
    const {
      attributes: {
        [key]: column
      }
    } = this;

    return column;
  }

  @readonly
  @nonconfigurable
  static getColumnName(key) {
    const column = this.getColumn(key);

    if (column) {
      return column.columnName;
    }
  }

  @readonly
  @nonconfigurable
  static getRelationship(key) {
    const {
      relationships: {
        [key]: relationship
      }
    } = this;

    return relationship;
  }
}

export initialize from './utils/initialize';
export default Model;
