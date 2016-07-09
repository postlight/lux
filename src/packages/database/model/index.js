import { dasherize, pluralize } from 'inflection';

import Query from '../query';
import { sql } from '../../logger';

import initializeClass from './initialize-class';

import validate from './utils/validate';

import pick from '../../../utils/pick';
import omit from '../../../utils/omit';
import entries from '../../../utils/entries';
import underscore from '../../../utils/underscore';

import type { options as relationshipOptions } from '../related/interfaces';

class Model {
  /**
   * @private
   */
  static table;

  /**
   * @private
   */
  static store;

  /**
   *
   */
  static logger;

  /**
   * @private
   */
  static serializer;

  /**
   * @private
   */
  static attributes: Object;

  /**
   *
   */
  static primaryKey: string = 'id';

  /**
   * @private
   */
  static initialized: boolean;

  constructor(attrs: {} = {}, initialize: boolean = true): Model {
    const {
      constructor: {
        attributeNames,
        relationshipNames
      }
    } = this;

    Object.defineProperties(this, {
      initialized: {
        value: initialize,
        writable: !initialize,
        enumerable: false,
        configurable: !initialize
      },

      rawColumnData: {
        value: attrs,
        writable: false,
        enumerable: false,
        configurable: false
      },

      initialValues: {
        value: new Map(),
        writable: false,
        enumerable: false,
        configurable: false
      },

      dirtyAttributes: {
        value: new Set(),
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    if (initialize) {
      Object.freeze(this);
    }

    Object.assign(
      this,
      pick(attrs, ...attributeNames, ...relationshipNames)
    );

    return this;
  }

  get isDirty(): boolean {
    return Boolean(this.dirtyAttributes.size);
  }

  get modelName(): string {
    return this.constructor.modelName;
  }

  static get hasOne(): Object {
    return Object.freeze({});
  }

  static set hasOne(value: Object): void {
    if (value && Object.keys(value).length) {
      Reflect.defineProperty(this, 'hasOne', {
        value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  static get hasMany(): Object {
    return Object.freeze({});
  }

  static set hasMany(value: Object): void {
    if (value && Object.keys(value).length) {
      Reflect.defineProperty(this, 'hasMany', {
        value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  static get belongsTo(): Object {
    return Object.freeze({});
  }

  static set belongsTo(value: Object): void {
    if (value && Object.keys(value).length) {
      Reflect.defineProperty(this, 'belongsTo', {
        value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  static get hooks(): Object {
    return Object.freeze({});
  }

  static set hooks(value: Object): void {
    if (value && Object.keys(value).length) {
      Reflect.defineProperty(this, 'hooks', {
        value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  static get scopes(): Object {
    return Object.freeze({});
  }

  static set scopes(value: Object): void {
    if (value && Object.keys(value).length) {
      Reflect.defineProperty(this, 'scopes', {
        value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  static get validates(): Object {
    return Object.freeze({});
  }

  static set validates(value: Object): void {
    if (value && Object.keys(value).length) {
      Reflect.defineProperty(this, 'validates', {
        value,
        writable: true,
        enumerable: false,
        configurable: true
      });
    }
  }

  static get modelName(): string {
    return dasherize(underscore(this.name));
  }

  static get tableName(): string {
    return pluralize(underscore(this.name));
  }

  static set tableName(value: string): void {
    if (value && value.length) {
      Reflect.defineProperty(this, 'tableName', {
        value,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }
  }

  static get relationships(): Object {
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

  static get attributeNames(): Array<string> {
    return Object.keys(this.attributes);
  }

  static get relationshipNames(): Array<string> {
    return Object.keys(this.relationships);
  }

  async update(attributes: Object = {}): Model {
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

    Object.assign(this, attributes);

    if (this.isDirty) {
      if (typeof beforeValidation === 'function') {
        await beforeValidation(this);
      }

      validate(this);

      if (typeof afterValidation === 'function') {
        await afterValidation(this);
      }

      if (typeof beforeUpdate === 'function') {
        await beforeUpdate(this);
      }

      if (typeof beforeSave === 'function') {
        await beforeSave(this);
      }

      this.updatedAt = new Date();

      const query = table()
        .where({ [primaryKey]: this[primaryKey] })
        .update(this.format('database', ...this.dirtyAttributes));

      if (debug) {
        const { constructor: { logger } } = this;

        query.on('query', () => {
          setImmediate(() => logger.info(sql`${query.toString()}`));
        });
      }

      await query;

      this.dirtyAttributes.clear();

      if (typeof afterUpdate === 'function') {
        await afterUpdate(this);
      }

      if (typeof afterSave === 'function') {
        await afterSave(this);
      }
    }

    return this;
  }

  async destroy(): Model {
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

    if (typeof beforeDestroy === 'function') {
      await beforeDestroy(this);
    }

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
        setImmediate(() => logger.info(sql`${query.toString()}`));
      });
    }

    await query;

    if (typeof afterDestroy === 'function') {
      await afterDestroy(this);
    }

    return this;
  }

  format(dest: string, ...only: Array<string>): {} {
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

  static initialize(store, table): Promise<typeof Model> {
    if (this.initialized) {
      return this;
    } else {
      return initializeClass({
        store,
        table,
        model: this
      });
    }
  }

  static async create(props = {}): Model {
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

    if (typeof beforeValidation === 'function') {
      await beforeValidation(instance);
    }

    validate(instance);

    if (typeof afterValidation === 'function') {
      await afterValidation(instance);
    }

    if (typeof beforeCreate === 'function') {
      await beforeCreate(instance);
    }

    if (typeof beforeSave === 'function') {
      await beforeSave(instance);
    }

    const query = table()
      .returning(primaryKey)
      .insert(omit(instance.format('database'), primaryKey));

    if (debug) {
      const { logger } = this;

      query.on('query', () => {
        setImmediate(() => logger.info(sql`${query.toString()}`));
      });
    }

    Object.assign(instance, {
      [primaryKey]: (await query)[0]
    });

    Reflect.defineProperty(instance, 'initialized', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.freeze(instance);

    if (typeof afterCreate === 'function') {
      await afterCreate(instance);
    }

    if (typeof afterSave === 'function') {
      await afterSave(instance);
    }

    return instance;
  }

  static all(): Query {
    return new Query(this).all();
  }

  static find(primaryKey: string | number): Query {
    return new Query(this).find(primaryKey);
  }

  static page(num: number): Query {
    return new Query(this).page(num);
  }

  static limit(amount: number): Query {
    return new Query(this).limit(amount);
  }

  static offset(amount: number): Query {
    return new Query(this).offset(amount);
  }

  static count(): Query {
    return new Query(this).count();
  }

  static order(attr: string, direction?: string): Query {
    return new Query(this).order(attr, direction);
  }

  static where(conditions: Object): Query {
    return new Query(this).where(conditions);
  }

  static not(conditions: Object): Query {
    return new Query(this).not(conditions);
  }

  static first(): Query {
    return new Query(this).first();
  }

  static last(): Query {
    return new Query(this).last();
  }

  static select(...params: Array<string>): Query {
    return new Query(this).select(...params);
  }

  static include(...relationships: Array<Object|string>): Query {
    return new Query(this).include(...relationships);
  }

  static unscope(...scopes: Array<string>): Query {
    return new Query(this).unscope(...scopes);
  }

  static hasScope(name: string): boolean {
    return Boolean(this.scopes[name]);
  }

  /**
   * Check if a value is an instance of a Model.
   */
  static isInstance(obj: mixed): boolean {
    return obj instanceof this;
  }

  static columnFor(key): Object {
    const {
      attributes: {
        [key]: column
      }
    } = this;

    return column;
  }

  static columnNameFor(key): string {
    const column = this.columnFor(key);

    if (column) {
      return column.columnName;
    }
  }

  static relationshipFor(key): relationshipOptions {
    const {
      relationships: {
        [key]: relationship
      }
    } = this;

    return relationship;
  }
}

export default Model;
