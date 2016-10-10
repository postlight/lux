// @flow
import { pluralize } from 'inflection';

import { NEW_RECORDS } from '../constants';
import Query from '../query';
import { sql } from '../../logger';
import { saveRelationships } from '../relationship';
import pick from '../../../utils/pick';
import omit from '../../../utils/omit';
import setType from '../../../utils/set-type';
import underscore from '../../../utils/underscore';
import type Logger from '../../logger'; // eslint-disable-line max-len, no-duplicate-imports
import type Database from '../../database';
import type Serializer from '../../serializer';
import type { Relationship$opts } from '../relationship'; // eslint-disable-line max-len, no-duplicate-imports

import initializeClass from './initialize-class';
import getColumns from './utils/get-columns';
import validate from './utils/validate';

/**
 * ### Overview
 *
 *
 * @module lux-framework
 * @namespace Lux
 * @class Model
 * @constructor
 * @public
 */
class Model {
  /**
   * The canonical name of a `Model`'s constructor.
   *
   * @property modelName
   * @type {String}
   * @public
   */
  modelName: string;

  /**
   * The name of the API resource a `Model` instance's constructor represents.
   *
   * @property resourceName
   * @type {String}
   * @public
   */
  resourceName: string;

  /**
   * @property initialized
   * @type {Boolean}
   * @private
   */
  initialized: boolean;

  /**
   * @property rawColumnData
   * @type {Boolean}
   * @private
   */
  rawColumnData: Object;

  /**
   * @property initialValues
   * @type {Map}
   * @private
   */
  initialValues: Map<string, mixed>;

  /**
   * @property dirtyAttributes
   * @type {Set}
   * @private
   */
  dirtyAttributes: Set<string>;

  /**
   * @property prevAssociations
   * @type {Set}
   * @private
   */
  isModelInstance: boolean;

  /**
   * @private
   */
  prevAssociations: Set<Model>;

  /**
   * A reference to the instance of the `Logger` used for the `Application` the
   * `Model` is a part of.
   *
   * @property logger
   * @type {Logger}
   * @static
   * @public
   */
  static logger: Logger;

  /**
   * The canonical name of a `Model`.
   *
   * @property modelName
   * @type {String}
   * @static
   * @public
   */
  static modelName: string;

  /**
   * The name of the API resource a `Model` represents.
   *
   * @property resourceName
   * @type {String}
   * @static
   * @public
   */
  static resourceName: string;

  /**
   * The column name to use for a `Model`'s primaryKey.
   *
   * @property primaryKey
   * @type {String}
   * @static
   * @private
   */
  static primaryKey: string = 'id';

  /**
   * @property table
   * @type {Function}
   * @static
   * @private
   */
  static table;

  /**
   * @property store
   * @type {Database}
   * @static
   * @private
   */
  static store: Database;

  /**
   * @property initialized
   * @type {Boolean}
   * @static
   * @private
   */
  static initialized: boolean;

  /**
   * @property serializer
   * @type {Serializer}
   * @static
   * @private
   */
  static serializer: Serializer<this>;

  /**
   * @property attributes
   * @type {Object}
   * @static
   * @private
   */
  static attributes: Object;

  /**
   * @property attributeNames
   * @type {Array}
   * @static
   * @private
   */
  static attributeNames: Array<string>;

  /**
   * @property relationships
   * @type {Object}
   * @static
   * @private
   */
  static relationships: Object;

  /**
   * @property relationshipNames
   * @type {Array}
   * @static
   * @private
   */
  static relationshipNames: Array<string>;

  constructor(attrs: Object = {}, initialize: boolean = true) {
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
      isModelInstance: {
        value: true,
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

    const props = pick(attrs, ...attributeNames.concat(relationshipNames));

    Object.assign(this, props);

    if (initialize) {
      Reflect.defineProperty(this, 'initialized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      Object.freeze(this);
      Object.freeze(this.rawColumnData);
    }

    NEW_RECORDS.add(this);

    return this;
  }

  /**
   * Indicates if the model is new.
   *
   * ```javascript
   * import Post from 'app/models/post';
   *
   * let post = new Post({
   *   body: '',
   *   title: 'New Post',
   *   isPublic: false
   * });
   *
   * post.isNew;
   * // => true
   *
   * Post.create({
   *   body: '',
   *   title: 'New Post',
   *   isPublic: false
   * }).then(post => {
   *   post.isNew;
   *   // => false;
   * });
   * ```
   *
   * @property isNew
   * @type {Boolean}
   * @public
   */
  get isNew(): boolean {
    return NEW_RECORDS.has(this);
  }

  /**
   * Indicates if the model is dirty.
   *
   * ```javascript
   * import Post from 'app/models/post';
   *
   * Post
   *  .find(1)
   *  .then(post => {
   *     post.isDirty;
   *     // => false
   *
   *     post.isPublic = true;
   *
   *     post.isDirty;
   *     // => true
   *
   *     return post.save();
   *   })
   *   .then(post => {
   *     post.isDirty;
   *     // => false
   *   });
   * ```
   *
   * @property isDirty
   * @type {Boolean}
   * @public
   */
  get isDirty(): boolean {
    return Boolean(this.dirtyAttributes.size);
  }

  /**
   * Indicates if the model is persisted.
   *
   * ```javascript
   * import Post from 'app/models/post';
   *
   * Post
   *  .find(1)
   *  .then(post => {
   *     post.persisted;
   *     // => true
   *
   *     post.isPublic = true;
   *
   *     post.persisted;
   *     // => false
   *
   *     return post.save();
   *   })
   *   .then(post => {
   *     post.persisted;
   *     // => true
   *   });
   * ```
   *
   * @property persisted
   * @type {Boolean}
   * @public
   */
  get persisted(): boolean {
    return !this.isNew && !this.isDirty;
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

  async save(deep?: boolean): Promise<this> {
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

    NEW_RECORDS.delete(this);
    this.dirtyAttributes.clear();

    if (typeof afterUpdate === 'function') {
      await afterUpdate(this);
    }

    if (typeof afterSave === 'function') {
      await afterSave(this);
    }

    return this;
  }

  async update(attributes: Object = {}): Promise<this> {
    Object.assign(this, attributes);

    if (this.isDirty) {
      return await this.save(true);
    }

    return this;
  }

  async destroy(): Promise<this> {
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
      .where({ [primaryKey]: this.getPrimaryKey() })
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
    return setType(() => pick(this, ...keys));
  }

  /**
   * @private
   */
  getPrimaryKey() {
    return Reflect.get(this, this.constructor.primaryKey);
  }

  static initialize(store, table): Promise<Class<this>> {
    if (this.initialized) {
      return Promise.resolve(this);
    }

    return initializeClass({
      store,
      table,
      model: this
    });
  }

  static async create(props = {}): Promise<this> {
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

    const [primaryKeyValue] = await query;

    Object.assign(instance, {
      [primaryKey]: primaryKeyValue
    });

    Reflect.set(instance.rawColumnData, primaryKey, primaryKeyValue);

    Reflect.defineProperty(instance, 'initialized', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    Object.freeze(instance);
    NEW_RECORDS.delete(instance);

    if (typeof afterCreate === 'function') {
      await afterCreate(instance);
    }

    if (typeof afterSave === 'function') {
      await afterSave(instance);
    }

    return instance;
  }

  static all(): Query<Array<this>> {
    return new Query(this).all();
  }

  static find(primaryKey: any): Query<this> {
    return new Query(this).find(primaryKey);
  }

  static page(num: number): Query<Array<this>> {
    return new Query(this).page(num);
  }

  static limit(amount: number): Query<Array<this>> {
    return new Query(this).limit(amount);
  }

  static offset(amount: number): Query<Array<this>> {
    return new Query(this).offset(amount);
  }

  static count(): Query<number> {
    return new Query(this).count();
  }

  static order(attr: string, direction?: string): Query<Array<this>> {
    return new Query(this).order(attr, direction);
  }

  static where(conditions: Object): Query<Array<this>> {
    return new Query(this).where(conditions);
  }

  static not(conditions: Object): Query<Array<this>> {
    return new Query(this).not(conditions);
  }

  static first(): Query<this> {
    return new Query(this).first();
  }

  static last(): Query<this> {
    return new Query(this).last();
  }

  static select(...params: Array<string>): Query<Array<this>> {
    return new Query(this).select(...params);
  }

  static distinct(...params: Array<string>): Query<Array<this>> {
    return new Query(this).distinct(...params);
  }

  static include(...relationships: Array<string | Object>): Query<Array<this>> {
    return new Query(this).include(...relationships);
  }

  static unscope(...scopes: Array<string>): Query<Array<this>> {
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

    return column ? column.columnName : undefined;
  }

  static relationshipFor(key: string): void | Relationship$opts {
    return Reflect.get(this.relationships, key);
  }
}

export default Model;
