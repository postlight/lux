// @flow
import { pluralize } from 'inflection';

import Query from '../query';
import ChangeSet from '../change-set';
import { updateRelationship } from '../relationship';
import {
  createTransactionResultProxy,
  createStaticTransactionProxy,
  createInstanceTransactionProxy
} from '../transaction';
import pick from '../../../utils/pick';
import underscore from '../../../utils/underscore';
import { compose } from '../../../utils/compose';
import { map as diffMap } from '../../../utils/diff';
import type Logger from '../../logger';
import type Database from '../../database';
import type Serializer from '../../serializer';
/* eslint-disable no-duplicate-imports */
import type { Relationship$opts } from '../relationship';
import type { Transaction$ResultProxy } from '../transaction';
/* eslint-enable no-duplicate-imports */

import { create, update, destroy, createRunner } from './utils/persistence';
import initializeClass from './initialize-class';
import validate from './utils/validate';
import runHooks from './utils/run-hooks';
import type { Model$Hooks } from './interfaces';

/**
 * ## Overview
 *
 * @module lux-framework
 * @namespace Lux
 * @class Model
 * @constructor
 * @public
 */
class Model {
  /**
   * The name of the corresponding database table for a `Model` instance's
   * constructor.
   *
   * @property tableName
   * @type {String}
   * @public
   */
  tableName: string;

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
   * A timestamp representing when the Model instance was created.
   *
   * @property createdAt
   * @type {Date}
   * @public
   */
  createdAt: Date;

  /**
   * A timestamp representing the last time the Model instance was updated.
   *
   * @property updatedAt
   * @type {Date}
   * @public
   */
  updatedAt: Date;

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
   * @private
   */
  changeSets: Array<ChangeSet>;

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
   * The name of the corresponding database table for a `Model`.
   *
   * @property tableName
   * @type {String}
   * @static
   * @public
   */
  static tableName: string;

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
   * @public
   */
  static primaryKey: string = 'id';

  /**
   * @property table
   * @type {Function}
   * @static
   * @private
   */
  static table: () => Knex$QueryBuilder;

  /**
   * @property hooks
   * @type {Object}
   * @static
   * @private
   */
  static hooks: Model$Hooks;

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

  constructor(attrs: Object = {}, initialize: boolean = true): this {
    Object.defineProperties(this, {
      changeSets: {
        value: [new ChangeSet()],
        writable: false,
        enumerable: false,
        configurable: false
      },
      rawColumnData: {
        value: attrs,
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

    const { constructor: { attributeNames, relationshipNames } } = this;
    const props = pick(attrs, ...attributeNames.concat(relationshipNames));

    Object.assign(this, props);

    if (initialize) {
      Reflect.defineProperty(this, 'initialized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }

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
    return !this.persistedChangeSet;
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

  /**
   * @property dirtyAttributes
   * @type {Map}
   */
  get dirtyAttributes(): Map<string, mixed> {
    const { currentChangeSet, persistedChangeSet } = this;

    if (!persistedChangeSet) {
      return new Map(currentChangeSet);
    }

    return diffMap(persistedChangeSet, currentChangeSet);
  }

  /**
   * @private
   */
  get currentChangeSet(): ChangeSet {
    return this.changeSets[0];
  }

  /**
   * @private
   */
  get persistedChangeSet(): void | ChangeSet {
    return this.changeSets.find(({ isPersisted }) => isPersisted);
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

  transacting(trx: Knex$Transaction): this {
    return createInstanceTransactionProxy(this, trx);
  }

  transaction<T>(fn: (...args: Array<any>) => Promise<T>): Promise<T> {
    return this.constructor.transaction(fn);
  }

  save(
    transaction?: Knex$Transaction
  ): Promise<Transaction$ResultProxy<this, *>> {
    const run = async (trx: Knex$Transaction) => {
      const { constructor: { hooks, logger } } = this;
      const statements = [];
      let hadDirtyAttrs = false;

      if (this.isDirty) {
        hadDirtyAttrs = true;

        await runHooks(this, trx, hooks.beforeValidation);

        validate(this);

        await runHooks(this, trx,
          hooks.afterValidation,
          hooks.beforeUpdate,
          hooks.beforeSave
        );

        await createRunner(logger, statements)(await update(this, trx));

        this.prevAssociations.clear();
        this.currentChangeSet.persist(this.changeSets);

        await runHooks(this, trx,
          hooks.afterUpdate,
          hooks.afterSave
        );
      }

      return createTransactionResultProxy(this, hadDirtyAttrs);
    };

    if (transaction) {
      return run(transaction);
    }

    return this.transaction(run);
  }

  update(
    props: Object = {},
    transaction?: Knex$Transaction
  ): Promise<Transaction$ResultProxy<this, *>> {
    const run = async (trx: Knex$Transaction) => {
      const { constructor: { hooks, logger } } = this;
      let statements = [];
      let promise = Promise.resolve([]);
      let hadDirtyAttrs = false;
      let hadDirtyAssoc = false;

      const associations = Object
        .keys(props)
        .filter(key => (
          Boolean(this.constructor.relationshipFor(key))
        ));

      Object.assign(this, props);

      if (associations.length) {
        hadDirtyAssoc = true;
        statements = associations.reduce((arr, key) => [
          ...arr,
          ...updateRelationship(this, key, trx)
        ], []);
      }

      if (this.isDirty) {
        hadDirtyAttrs = true;

        await runHooks(this, trx, hooks.beforeValidation);

        validate(this);

        await runHooks(this, trx,
          hooks.afterValidation,
          hooks.beforeUpdate,
          hooks.beforeSave
        );

        promise = update(this, trx);
      }

      await createRunner(logger, statements)(await promise);

      this.prevAssociations.clear();
      this.currentChangeSet.persist(this.changeSets);

      if (hadDirtyAttrs) {
        await runHooks(this, trx,
          hooks.afterUpdate,
          hooks.afterSave
        );
      }

      return createTransactionResultProxy(this, hadDirtyAttrs || hadDirtyAssoc);
    };

    if (transaction) {
      return run(transaction);
    }

    return this.transaction(run);
  }

  destroy(
    transaction?: Knex$Transaction
  ): Promise<Transaction$ResultProxy<this, true>> {
    const run = async (trx: Knex$Transaction) => {
      const { constructor: { hooks, logger } } = this;

      await runHooks(this, trx, hooks.beforeDestroy);
      await createRunner(logger, [])(await destroy(this, trx));
      await runHooks(this, trx, hooks.afterDestroy);

      return createTransactionResultProxy(this, true);
    };

    if (transaction) {
      return run(transaction);
    }

    return this.transaction(run);
  }

  async reload(): Promise<this> {
    if (this.isNew) {
      return this;
    }

    return await this.constructor.find(this.getPrimaryKey());
  }

  rollback(): this {
    const { persistedChangeSet } = this;

    if (persistedChangeSet && !this.currentChangeSet.isPersisted) {
      persistedChangeSet
        .applyTo(this)
        .persist(this.changeSets);
    }

    return this;
  }

  getAttributes(...keys: Array<string>): Object {
    return pick(this, ...keys);
  }

  /**
   * @private
   */
  getPrimaryKey(): number {
    return Reflect.get(this, this.constructor.primaryKey);
  }

  static initialize(store, table): Promise<Class<this>> {
    if (this.initialized) {
      return Promise.resolve(this);
    }

    if (!this.tableName) {
      const getTableName = compose(pluralize, underscore);
      const tableName = getTableName(this.name);

      Reflect.defineProperty(this, 'tableName', {
        value: tableName,
        writable: false,
        enumerable: true,
        configurable: false
      });

      Reflect.defineProperty(this.prototype, 'tableName', {
        value: tableName,
        writable: false,
        enumerable: false,
        configurable: false
      });
    }

    return initializeClass({
      store,
      table,
      model: this
    });
  }

  static create(
    props: Object = {},
    transaction?: Knex$Transaction
  ): Promise<Transaction$ResultProxy<this, true>> {
    const run = async (trx: Knex$Transaction) => {
      const { hooks, logger, primaryKey } = this;
      const instance = Reflect.construct(this, [props, false]);
      let statements = [];

      const associations = Object
        .keys(props)
        .filter(key => (
          Boolean(this.relationshipFor(key))
        ));

      if (associations.length) {
        statements = associations.reduce((arr, key) => [
          ...arr,
          ...updateRelationship(instance, key, trx)
        ], []);
      }

      await runHooks(instance, trx, hooks.beforeValidation);

      validate(instance);

      await runHooks(instance, trx,
        hooks.afterValidation,
        hooks.beforeCreate,
        hooks.beforeSave
      );

      const runner = createRunner(logger, statements);
      const [[primaryKeyValue]] = await runner(await create(instance, trx));

      Reflect.set(instance, primaryKey, primaryKeyValue);
      Reflect.set(instance.rawColumnData, primaryKey, primaryKeyValue);

      Reflect.defineProperty(instance, 'initialized', {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false
      });

      instance.currentChangeSet.persist(instance.changeSets);

      await runHooks(instance, trx,
        hooks.afterCreate,
        hooks.afterSave
      );

      return createTransactionResultProxy(instance, true);
    };

    if (transaction) {
      return run(transaction);
    }

    return this.transaction(run);
  }

  static transacting(trx: Knex$Transaction): Class<this> {
    return createStaticTransactionProxy(this, trx);
  }

  static transaction<T>(fn: (...args: Array<any>) => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const { store: { connection } } = this;
      let result: T;

      connection
        .transaction(trx => {
          fn(trx)
            .then(data => {
              result = data;
              return trx.commit();
            })
            .catch(trx.rollback);
        })
        .then(() => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
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
export type { Model$Hook, Model$Hooks } from './interfaces';
