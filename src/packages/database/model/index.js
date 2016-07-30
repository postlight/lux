// @flow
import { pluralize } from 'inflection';

import Query from '../query';
import { sql } from '../../logger';
import { saveRelationships } from '../relationship';

import initializeClass from './initialize-class';

import pick from '../../../utils/pick';
import omit from '../../../utils/omit';
import setType from '../../../utils/set-type';
import tryCatch from '../../../utils/try-catch';
import underscore from '../../../utils/underscore';
import validate from './utils/validate';
import getColumns from './utils/get-columns';
import processWriteError from './utils/process-write-error';

import type Logger from '../../logger';
import type Database from '../../database';
import type Serializer from '../../serializer';
import type { Relationship$opts } from '../relationship';

class Model {
  /**
   * The canonical name of a `Model`'s constructor.
   *
   * @property modelName
   * @memberof Model
   * @instance
   */
  modelName: string;

  /**
   * The name of the API resource a `Model` instance's constructor represents.
   *
   * @property resourceName
   * @memberof Model
   * @instance
   */
  resourceName: string;

  /**
   * @private
   */
  initialized: boolean;

  /**
   * @private
   */
  rawColumnData: Object;

  /**
   * @private
   */
  initialValues: Map<string, mixed>;

  /**
   * @private
   */
  dirtyAttributes: Set<string>;

  /**
   * @private
   */
  prevAssociations: Set<Model>;

  /**
   * A reference to the instance of the `Logger` used for the `Application` the
   * `Model` is a part of.
   *
   * @property logger
   * @memberof Model
   */
  static logger: Logger;

  /**
   * The column name to use for a `Model`'s primaryKey.
   *
   * @property primaryKey
   * @memberof Model
   */
  static primaryKey: string = 'id';

  /**
   * The canonical name of a `Model`.
   *
   * @property modelName
   * @memberof Model
   */
  static modelName: string;

  /**
   * The name of the API resource a `Model` represents.
   *
   * @property resourceName
   * @memberof Model
   */
  static resourceName: string;

  /**
   * @private
   */
  static table;

  /**
   * @private
   */
  static store: Database;

  /**
   * @private
   */
  static initialized: boolean;

  /**
   * @private
   */
  static serializer: Serializer;

  /**
   * @private
   */
  static attributes: Object;

  /**
   * @private
   */
  static attributeNames: Array<string>;

  /**
   * @private
   */
  static relationships: Object;

  /**
   * @private
   */
  static relationshipNames: Array<string>;

  constructor(attrs: {} = {}, initialize: boolean = true) {
    const { constructor: { attributeNames, relationshipNames } } = this;

    Object.defineProperties(this, {
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
      },

      prevAssociations: {
        value: new Set(),
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    attrs = pick(attrs, ...attributeNames.concat(relationshipNames));
    Object.assign(this, attrs);

    if (initialize) {
      Reflect.defineProperty(this, 'initialized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.freeze(this);
    }

    return this;
  }

  get isDirty(): boolean {
    return Boolean(this.dirtyAttributes.size);
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

  save(deep?: boolean): Promise<void | Model> {
    return tryCatch(async () => {
      const {
        constructor: {
          table,
          logger,
          primaryKey,

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

      Reflect.set(this, 'updatedAt', new Date());

      const query = table()
        .where({ [primaryKey]: Reflect.get(this, primaryKey) })
        .update(getColumns(this, Array.from(this.dirtyAttributes)))
        .on('query', () => {
          setImmediate(() => logger.debug(sql`${query.toString()}`));
        });

      if (deep) {
        await Promise.all([
          query,
          saveRelationships(this)
        ]);

        this.prevAssociations.clear();
      } else {
        await query;
      }

      this.dirtyAttributes.clear();

      if (typeof afterUpdate === 'function') {
        await afterUpdate(this);
      }

      if (typeof afterSave === 'function') {
        await afterSave(this);
      }

      return this;
    }, err => {
      throw processWriteError(err);
    });
  }

  async update(attributes: Object = {}): Promise<Model> {
    Object.assign(this, attributes);
    return this.isDirty ? await this.save(true) : this;
  }

  async destroy(): Promise<Model> {
    const {
      constructor: {
        primaryKey,
        logger,
        table,

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
      .where({ [primaryKey]: Reflect.get(this, primaryKey) })
      .del()
      .on('query', () => {
        setImmediate(() => logger.debug(sql`${query.toString()}`));
      });

    await query;

    if (typeof afterDestroy === 'function') {
      await afterDestroy(this);
    }

    return this;
  }

  getAttributes(...keys: Array<string>): Object {
    if (!keys.length) {
      keys = this.constructor.attributeNames;
    }

    return setType(() => pick(this, ...keys));
  }

  /**
   * @private
   */
  getPrimaryKey(): any {
    return Reflect.get(this, this.constructor.primaryKey);
  }

  static initialize(store, table): Promise<Class<this>> {
    if (this.initialized) {
      return Promise.resolve(this);
    } else {
      return initializeClass({
        store,
        table,
        model: this
      });
    }
  }

  static create(props = {}) {
    return tryCatch(async () => {
      const {
        primaryKey,
        logger,
        table,

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
      const instance = Reflect.construct(this, [{
        ...props,
        createdAt: datetime,
        updatedAt: datetime
      }, false]);

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
        .insert(omit(getColumns(instance), primaryKey))
        .on('query', () => {
          setImmediate(() => logger.debug(sql`${query.toString()}`));
        });

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
    }, err => {
      throw processWriteError(err);
    });
  }

  static all() {
    return new Query(this).all();
  }

  static find(primaryKey: string | number) {
    return new Query(this).find(primaryKey);
  }

  static page(num: number) {
    return new Query(this).page(num);
  }

  static limit(amount: number) {
    return new Query(this).limit(amount);
  }

  static offset(amount: number) {
    return new Query(this).offset(amount);
  }

  static count() {
    return new Query(this).count();
  }

  static order(attr: string, direction?: string) {
    return new Query(this).order(attr, direction);
  }

  static where(conditions: Object) {
    return new Query(this).where(conditions);
  }

  static not(conditions: Object) {
    return new Query(this).not(conditions);
  }

  static first() {
    return new Query(this).first();
  }

  static last() {
    return new Query(this).last();
  }

  static select(...params: Array<string>) {
    return new Query(this).select(...params);
  }

  static include(...relationships: Array<Object|string>) {
    return new Query(this).include(...relationships);
  }

  static unscope(...scopes: Array<string>) {
    return new Query(this).unscope(...scopes);
  }

  static hasScope(name: string) {
    return Boolean(Reflect.get(this.scopes, name));
  }

  /**
   * Check if a value is an instance of a Model.
   */
  static isInstance(obj: mixed): boolean {
    return obj instanceof this;
  }

  static columnFor(key: string): void | Object {
    return Reflect.get(this.attributes, key);
  }

  static columnNameFor(key: string): void | string {
    const column = this.columnFor(key);

    if (column) {
      return column.columnName;
    }
  }

  static relationshipFor(key: string): void | Relationship$opts {
    return Reflect.get(this.relationships, key);
  }
}

export default Model;
