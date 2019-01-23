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
import mapToObject from '../../../utils/map-to-object';
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
 * @class Model
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
   * @type {Object}
   * @private
   */
  rawColumnData: Object;

  /**
   * @property isModelInstance
   * @type {Boolean}
   * @private
   */
  isModelInstance: boolean;

  /**
   * @property prevAssociations
   * @type {Set}
   * @private
   */
  prevAssociations: Set<Model>;

  /**
   * @property changeSets
   * @type {Array}
   * @private
   */
  changeSets: Array<ChangeSet>;

  /**
   * An object where you declare `hasOne` relationships.
   *
   * When declaring a relationship you must specify the inverse of the
   * relationship.
   *
   * ```javascript
   * class User extends Model {
   *   static hasOne = {
   *     profile: {
   *       inverse: 'user'
   *       // The line above lets Lux know that this relationship is accessible
   *       // on profile instances via `profile.user`.
   *     }
   *   };
   * }
   *
   * class Profile extends Model {
   *   static belongsTo = {
   *     user: {
   *       inverse: 'profile'
   *       // The line above lets Lux know that this relationship is accessible
   *       // on user instances via `user.profile`.
   *     }
   *   };
   * }
   * ```
   *
   * If the name of the model is different than the key of the relationship, you
   * must specify it in the relationship object.
   *
   * ```javascript
   * class Profile extends Model {
   *   static belongsTo = {
   *     owner: {
   *       inverse: 'profile',
   *       model: 'user'
   *       // The line above lets Lux know that this is a relationship with the
   *       // `User` model and not a non-existent `Owner` model.
   *     }
   *   };
   * }
   * ```
   *
   * @property hasOne
   * @type {Object}
   * @default {}
   * @static
   * @public
   */
  static hasOne: Object;

  /**
   * An object where you declare `hasMany` relationships.
   *
   * When declaring a relationship you must specify the inverse of the
   * relationship.
   *
   * ```javascript
   * class Author extends Model {
   *   static hasMany = {
   *     books: {
   *       inverse: 'author'
   *       // The line above lets Lux know that this relationship is accessible
   *       // on book instances via `book.author`.
   *     }
   *   };
   * }
   *
   * class Book extends Model {
   *   static belongsTo = {
   *     author: {
   *       inverse: 'books'
   *       // The line above lets Lux know that this relationship is accessible
   *       // on author instances via `author.books`.
   *     }
   *   };
   * }
   * ```
   *
   * If the name of the model is different than the key of the relationship, you
   * must specify it in the relationship object.
   *
   * ```javascript
   * class Author extends Model {
   *   static hasMany = {
   *     publications: {
   *       inverse: 'author',
   *       model: 'book'
   *       // The line above lets Lux know that this is a relationship with the
   *       // `Book` model and not a non-existent `Publication` model.
   *     }
   *   };
   * }
   * ```
   *
   * ##### Many to Many
   *
   * In the examples above there is only one owner of relationship. Sometimes we
   * need to express a many to many relationship. Typically in relational
   * databases, this is done with a join table. When declaring a many to many
   * relationship that uses a join table, you must specify the join model.
   *
   * ```javascript
   * class Categorization extends Model {
   *   static belongsTo = {
   *     tag: {
   *       inverse: 'categorization'
   *     },
   *     post: {
   *       inverse: 'categorization'
   *     }
   *   }
   * }
   *
   * class Tag extends Model {
   *   static hasMany = {
   *     posts: {
   *       inverse: 'tags',
   *       through: 'categorizations'
   *     }
   *   };
   * }
   *
   * class Post extends Model {
   *   static hasMany = {
   *     tags: {
   *       inverse: 'posts',
   *       through: 'categorizations'
   *     }
   *   };
   * }
   * ```
   *
   * @property hasMany
   * @type {Object}
   * @default {}
   * @static
   * @public
   */
  static hasMany: Object;

  /**
   * An object where you declare `belongsTo` relationships.
   *
   * When declaring a relationship you must specify the inverse of the
   * relationship.
   *
   * ```javascript
   * class Book extends Model {
   *   static belongsTo = {
   *     author: {
   *       inverse: 'books'
   *       // The line above lets Lux know that this relationship is accessible
   *       // on author instances via `author.books`.
   *     }
   *   };
   * }
   *
   * class Author extends Model {
   *   static hasMany = {
   *     books: {
   *       inverse: 'book'
   *       // The line above lets Lux know that this relationship is accessible
   *       // on book instances via `book.author`.
   *     }
   *   };
   * }
   * ```
   *
   * If the name of the model is different than the key of the relationship, you
   * must specify it in the relationship object.
   *
   * ```javascript
   * class Book extends Model {
   *   static belongsTo = {
   *     writer: {
   *       inverse: 'books',
   *       model: 'author'
   *       // The line above lets Lux know that this is a relationship with the
   *       // `Author` model and not a non-existent `Writer` model.
   *     }
   *   };
   * }
   * ```
   *
   * Sometimes our foreign keys in the database do not follow conventions (i.e
   * `author_id`). You have the option to manually specify foreign keys when a
   * situation like this occurs.
   *
   * ```javascript
   * class Book extends Model {
   *   static belongsTo = {
   *     author: {
   *       inverse: 'books',
   *       foreignKey: 'SoMe_UnCoNvEnTiOnAl_FoReIgN_KeY'
   *     }
   *   };
   * }
   * ```
   *
   * @property belongsTo
   * @type {Object}
   * @default {}
   * @static
   * @public
   */
  static belongsTo: Object;

  /**
   * An object where you declare validations for an instance's attributes.
   *
   * Before a model instance is saved, validations declared in this block are
   * executed. To declare a validation for a model attribute, simply add the
   * attribute name as a key to the validates object. The value for the
   * attribute key should be a function that takes a single argument (the value
   * to validate against) and return a boolean value represent whether or not
   * the attribute is valid.
   *
   * ```javascript
   * class User extends Model {
   *   static validates {
   *     username: value => /^\w{2,30}$/.test(value),
   *     password: value => String(value).length >= 8
   *   };
   * }
   * ```
   *
   * In the spirit of have a small api surface area, Lux provides no validation
   * helper functions. You can roll your own helpers with or use one of the many
   * excellent validation libraries like [validator](https://goo.gl/LWaHBB).
   *
   * ```javascript
   * import { isEmail } from 'validator';
   *
   * class User extends Model {
   *   static validates {
   *     email: isEmail
   *   };
   * }
   * ```
   *
   * @property validates
   * @type {Object}
   * @default {}
   * @static
   * @public
   */
  static validates: Object;

  /**
   * An object where you declare custom query scopes for the model.
   *
   * Scopes allow you to DRY up query logic by chaining custom set's of queries
   * with built-in query method such as `where`, `not`, `page`, etc. To declare
   * a scope, add it as a method on the scopes object.
   *
   * ```javascript
   * class Post extends Model {
   *   static hasMany = {
   *     tags: {
   *       inverse: 'posts'
   *     },
   *     comments: {
   *       inverse: 'post'
   *     }
   *   };
   *
   *   static belongsTo = {
   *     user: {
   *       inverse: 'posts'
   *     }
   *   };
   *
   *   static scopes = {
   *     isPublic() {
   *       return this.where({
   *         isPublic: true
   *       });
   *     },
   *
   *     byUser(user) {
   *       return this.where({
   *         userId: user.id
   *       });
   *     },
   *
   *     withEverything() {
   *       return this.includes('tags', 'user', 'comments');
   *     }
   *   };
   * }
   * ```
   *
   * Given the scopes declared in the example above, here is how we could return
   * all the public posts with relationships eager loaded for the user with the
   * id of 1.
   *
   * ```javascript
   * const user = await User.find(1);
   *
   * return Post
   *   .byUser(user)
   *   .isPublic()
   *   .withEverything();
   * ```
   *
   * Since scopes can be chained with built-in query methods, we can easily
   * paginate this collection.
   *
   * ```javascript
   * const user = await User.find(1);
   *
   * return Post
   *   .byUser(user)
   *   .isPublic()
   *   .withEverything()
   *   .page(1);
   * ```
   *
   * @property scopes
   * @type {Object}
   * @default {}
   * @static
   * @public
   */
  static scopes: Object;

  /**
   * An object where you declare hooks to execute at certain times in a model
   * instance's lifecycle.
   *
   * There are many lifecycle hooks that are executed through out a model
   * instance's lifetime. The have many use cases such as sanitization of
   * attributes, creating dependent relationships, hashing passwords, and much
   * more.
   *
   * ##### Execution Order
   *
   * When creating a record.
   *
   * 1. beforeValidation
   * 2. afterValidation
   * 3. beforeCreate
   * 4. beforeSave
   * 5. afterCreate
   * 6. afterSave
   *
   * When updating a record.
   *
   * 1. beforeValidation
   * 2. afterValidation
   * 3. beforeUpdate
   * 4. beforeSave
   * 5. afterUpdate
   * 6. afterSave
   *
   * When deleting a record.
   *
   * 1. beforeDestroy
   * 2. afterDestroy
   *
   * ##### Anatomy
   *
   * Hooks are async functions that are called with two arguments. The first
   * argument is the record that the hook applies to and the second argument is
   * the transaction object relevant to the method from which the hook was
   * called.
   *
   * The only time you will need to use the transaction object is if you are
   * creating, updating, or deleting different record(s) within the hook. Using
   * the transaction object when modifying the database in a hook ensures that
   * any modifications made within the hook will be rolled back if the function
   * that initiated the transaction fails.
   *
   * ```javascript
   * import Notification from 'app/models/notification';
   *
   * class Comment extends Model {
   *   static belongsTo = {
   *     post: {
   *       inverse: 'comments'
   *     },
   *     user: {
   *       inverse: 'comments'
   *     }
   *   };
   *
   *   static hooks = {
   *     async afterCreate(comment, trx) {
   *       let [post, commenter] = await Promise.all([
   *         comment.post,
   *         comment.user
   *       ]);
   *
   *       const commentee = await post.user;
   *
   *       post = post.title;
   *       commenter = commenter.name;
   *
   *       // Calling .transacting(trx) prevents the commentee from getting a
   *       // notification if the comment fails to be persisted in the database.
   *       await Notification
   *         .transacting(trx)
   *         .create({
   *           user: commentee,
   *           message: `${commenter} commented on your post "${post}"`
   *         });
   *     },
   *
   *     async afterSave() {
   *       // Good thing you called transacting in afterCreate.
   *       throw new Error('Fatal Error');
   *     }
   *   };
   * }
   * ```
   *
   * @property hooks
   * @type {Object}
   * @default {}
   * @static
   * @public
   */
  static hooks: Model$Hooks;

  /**
   * A reference to the application's logger.
   *
   * @property logger
   * @type {Logger}
   * @static
   * @public
   */
  static logger: Logger;

  /**
   * The name of the corresponding database table for the model.
   *
   * @property tableName
   * @type {String}
   * @static
   * @public
   */
  static tableName: string;

  /**
   * The canonical name of the model.
   *
   * @property modelName
   * @type {String}
   * @static
   * @public
   */
  static modelName: string;

  /**
   * The name of the resource the model represents.
   *
   * @property resourceName
   * @type {String}
   * @static
   * @public
   */
  static resourceName: string;

  /**
   * The column name to use for a model's primary key.
   *
   * @property primaryKey
   * @type {String}
   * @default 'id'
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
  static table: () => Object;

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
    return Boolean(this.dirtyProperties.size);
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
   * @public
   */
  get dirtyAttributes(): Map<string, any> {
    const {
      dirtyProperties,
      constructor: {
        relationshipNames
      }
    } = this;

    Array
      .from(dirtyProperties.keys())
      .forEach(key => {
        if (relationshipNames.indexOf(key) >= 0) {
          dirtyProperties.delete(key);
        }
      });

    return dirtyProperties;
  }

  /**
   * @property dirtyRelationships
   * @type {Map}
   * @public
   */
  get dirtyRelationships(): Map<string, any> {
    const {
      dirtyProperties,
      constructor: {
        attributeNames
      }
    } = this;

    Array
      .from(dirtyProperties.keys())
      .forEach(key => {
        if (attributeNames.indexOf(key) >= 0) {
          dirtyProperties.delete(key);
        }
      });

    return dirtyProperties;
  }

  /**
   * @property dirtyProperties
   * @type {Map}
   * @private
   */
  get dirtyProperties(): Map<string, any> {
    const { currentChangeSet, persistedChangeSet } = this;

    if (!persistedChangeSet) {
      return new Map(currentChangeSet);
    }

    return diffMap(persistedChangeSet, currentChangeSet);
  }

  /**
   * @property currentChangeSet
   * @type {ChangeSet}
   * @private
   */
  get currentChangeSet(): ChangeSet {
    return this.changeSets[0];
  }

  /**
   * @property currentChangeSet
   * @type {void | ChangeSet}
   * @private
   */
  get persistedChangeSet(): void | ChangeSet {
    return this.changeSets.find(({ isPersisted }) => isPersisted);
  }

  /**
   * Specify the transaction object to use for following save, update, or
   * destroy method calls.
   *
   * When you call a method like update or destroy, lux will create a
   * transaction and wrap the internals of the method and other downstream
   * method calls like model hooks within. In some edge cases it can be more
   * useful to manually initiate the transaction. Bulk updating or destroying
   * are good examples of this. When you manually begin a transaction, you can
   * call this method to specify the transaction object that you would like to
   * use for subsequent mutation methods (save, update, destroy, etc.) so lux
   * knows not to automatically begin a new transaction if/when a mutation
   * method is called.
   *
   * ```javascript
   * const post = await Post.first();
   *
   * // This call to update uses the transaction that lux will initiate.
   * await post.update({
   *   // updates to post...
   * });
   *
   * await post.transaction(trx => {
   *   // This call to update uses the transaction that we created with the
   *   // call to the transaction method.
   *   return post
   *     .transacting(trx)
   *     .update({
   *       // updates to post...
   *     });
   * });
   * ```
   *
   * @method transacting
   * @param {Transaction} transaction - A transaction object to forward to save,
   * update, or destroy method calls.
   * @return {Model} - Returns a proxied version of `this` that delagates the
   * transaction param to subsquent save, update, or destroy method calls.
   * @public
   */
  transacting(trx: Object): this {
    return createInstanceTransactionProxy(this, trx);
  }

  /**
   * Manually begin a new transaction.
   *
   * Most of the time, you don't need to start transactions yourself. However,
   * if you need to do something like implement bulk updating of related records
   * the transaction method can be useful.
   *
   * ```javascript
   * const post = await Post.first().include('user');
   * const user = await post.user;
   *
   * await post.transaction(trx => {
   *   return Promise.all([
   *     post.transacting(trx).update({
   *       // updates to post...
   *     }),
   *     user.transacting(trx).update({
   *       // updates to user...
   *     })
   *   ]);
   * });
   * ```
   *
   * @method transaction
   * @param {Function} fn - The function used for executing the tranasction.
   * This function is called with a new transaction object as it's only argument
   * and is expected to return a promise.
   * @return {Promise} Resolves with the resolved value of the fn param.
   * @public
   */
  transaction<T>(fn: (...args: Array<any>) => Promise<T>): Promise<T> {
    return this.constructor.transaction(fn);
  }

  /**
   * Persist any unsaved changes to the database.
   *
   * ```javascript
   * const post = await Post.first();
   *
   * console.log(post.title, post.isDirty);
   * // => 'New Post' false
   *
   * post.title = 'How to Save a Lux Model';
   *
   * console.log(post.title, post.isDirty);
   * // => 'How to Update a Lux Model' true
   *
   * await post.save();
   *
   * console.log(post.title, post.isDirty);
   * // => 'How to Save a Lux Model' false
   * ```
   *
   * @method save
   * @return {Promise} Resolves with `this`.
   * @public
   */
  save(transaction?: Object): Promise<Transaction$ResultProxy<this, *>> {
    return this.update(mapToObject(this.dirtyProperties), transaction);
  }

  /**
   * Assign values to the instance and persist any changes to the database.
   *
   * ```javascript
   * const post = await Post.first();
   *
   * console.log(post.title, post.isPublic, post.isDirty);
   * // => 'New Post' false false
   *
   * await post.update({
   *   title: 'How to Update a Lux Model',
   *   isPublic: true
   * });
   *
   * console.log(post.title, post.isPublic, post.isDirty);
   * // => 'How to Update a Lux Model' true false
   * ```
   *
   * @method update
   * @param {Object} properties - An object containing key, value pairs of the
   * attributes and/or relationships you would like to assign to the instance.
   * @return {Promise} Resolves with `this`.
   * @public
   */
  update(
    props: Object = {},
    transaction?: Object
  ): Promise<Transaction$ResultProxy<this, *>> {
    const run = async (trx: Object) => {
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

  /**
   * Permanently delete the instance from the database.
   *
   * @method destroy
   * @return {Promise} Resolves with `this`.
   * @public
   */
  destroy(transaction?: Object): Promise<Transaction$ResultProxy<this, true>> {
    const run = async (trx: Object) => {
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

  /**
   * Reload the record from the database.
   *
   * @method reload
   * @return {Promise} Resolves with `this`.
   * @public
   */
  reload(): Promise<this> {
    if (this.isNew) {
      return Promise.resolve(this);
    }

    return this.constructor.find(this.getPrimaryKey());
  }

  /**
   * Rollback attributes and relationships to the last known persisted set of
   * values.
   *
   * @method rollback
   * @return {Model} Returns `this`.
   * @public
   */
  rollback(): this {
    const { persistedChangeSet } = this;

    if (persistedChangeSet && !this.currentChangeSet.isPersisted) {
      persistedChangeSet
        .applyTo(this)
        .persist(this.changeSets);
    }

    return this;
  }

  /**
   * @method getAttributes
   * @param {String} [...keys] - The keys of the properties to return.
   * @return {Object} An object containing keys that were passed in as agruments
   * and their associated values.
   * @private
   */
  getAttributes(...keys: Array<string>): Object {
    return pick(this, ...keys);
  }

  /**
   * @method getPrimaryKey
   * @return {Number} The value of the primary key for the instance.
   * @private
   */
  getPrimaryKey(): number {
    return Reflect.get(this, this.constructor.primaryKey);
  }

  /**
   * Create and persist a new instance of the model.
   *
   * @method create
   * @param {Object} properties - An object containing key, value pairs of the
   * attributes and/or relationships you would like to assign to the instance.
   * @return {Promise} Resolves with the newly created model.
   * @static
   * @public
   */
  static create(
    props: Object = {},
    transaction?: Object
  ): Promise<Transaction$ResultProxy<this, true>> {
    const run = async (trx: Object) => {
      const { hooks, logger, primaryKey } = this;
      const instance = Reflect.construct(this, [props, false]);

      await runHooks(instance, trx, hooks.beforeValidation);

      validate(instance);

      await runHooks(instance, trx,
        hooks.afterValidation,
        hooks.beforeCreate,
        hooks.beforeSave
      );

      const runner = createRunner(logger, []);
      const [[primaryKeyValue]] = await runner(await create(instance, trx));

      Reflect.set(instance, primaryKey, primaryKeyValue);
      Reflect.set(instance.rawColumnData, primaryKey, primaryKeyValue);

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

      await Promise.all(statements);

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

  /**
   * Specify the transaction object to use for following save, update, or
   * destroy method calls.
   *
   * When you call a method like update or destroy, lux will create a
   * transaction and wrap the internals of the method and other downstream
   * method calls like model hooks within. In some edge cases it can be more
   * useful to manually initiate the transaction. Bulk updating or destroying
   * are good examples of this. When you manually begin a transaction, you can
   * call this method to specify the transaction object that you would like to
   * use for calls to the static create method so lux knows not to automatically
   * begin a new transaction if/when the static create method is called.
   *
   * ```javascript
   * // This call to create uses the transaction that lux will initiate.
   * await Post.create();
   *
   * await Post.transaction(trx => {
   *   // This call to create uses the transaction that we created with the
   *   // call to the transaction method.
   *   return Post
   *     .transacting(trx)
   *     .create();
   * });
   * ```
   *
   * @method transacting
   * @param {Transaction} transaction - A transaction object to forward to
   * create method calls.
   * @return {Model} - Returns a proxied version of `this` that delagates the
   * transaction param to subsquent create method calls.
   * @static
   * @public
   */
  static transacting(trx: Object): Class<this> {
    return createStaticTransactionProxy(this, trx);
  }

  /**
   * Manually begin a new transaction.
   *
   * Most of the time, you don't need to start transactions yourself. However,
   * the transaction method can be useful if you need to do something like
   * bulk creating records.
   *
   * ```javascript
   * await Post.transaction(trx => {
   *   return Promise.all([
   *     Post.transacting(trx).create({
   *       // ...props
   *     }),
   *     Post.transacting(trx).create({
   *       // ...props
   *     })
   *   ]);
   * });
   * ```
   *
   * @method transaction
   * @param {Function} fn - The function used for executing the tranasction.
   * This function is called with a new transaction object as it's only argument
   * and is expected to return a promise.
   * @return {Promise} Resolves with the resolved value of the fn param.
   * @static
   * @public
   */
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

  static whereBetween(conditions: Object): Query<Array<this>> {
    return new Query(this).whereBetween(conditions);
  }

  static whereRaw(
    query: string,
    bindings: Array<any> = []): Query<Array<this>> {
    return new Query(this).whereRaw(query, bindings);
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

  /**
   * Check if a model has a scope.
   *
   * @method hasScope
   * @param {String} name - The name of the scope to look for.
   * @return {Boolean}
   * @static
   * @public
   */
  static hasScope(name: string): boolean {
    return Boolean(Reflect.get(this.scopes, name));
  }

  /**
   * Check if a value is an instance of a model.
   *
   * @method isInstance
   * @param {any} value - The value in question.
   * @return {Boolean}
   * @static
   * @public
   */
  static isInstance(value: any): boolean {
    return value instanceof this;
  }

  /**
   * Bind the model's connection to the database and get inferred data from the
   * schema upon application boot.
   *
   * @method initialize
   * @param {Database} store - A reference of the applications database
   * instance.
   * @param {Table} table - A function that returns a knex query builder bound
   * to the model's table name.
   * @return {Promise} Resolves with the model class.
   * @static
   * @private
   */
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

  /**
   * @method columnFor
   * @param {String} key - The respective attribute name of the column.
   * @return {void | Object} An object containing metadata about the column if a
   * match is found.
   * @static
   * @private
   */
  static columnFor(key: string): void | Object {
    return Reflect.get(this.attributes, key);
  }

  /**
   * @method columnNameFor
   * @param {String} key - The respective attribute name of the column.
   * @return {void | String} The name of the column in the database if a match
   * is found.
   * @static
   * @private
   */
  static columnNameFor(key: string): void | string {
    const column = this.columnFor(key);

    return column ? column.columnName : undefined;
  }

  /**
   * @method relationshipFor
   * @param {String} key - The name of the relationship to match against.
   * @return {void | Object} An object containing relationship metadata if a
   * match is found.
   * @static
   * @private
   */
  static relationshipFor(key: string): void | Relationship$opts {
    return Reflect.get(this.relationships, key);
  }
}

export default Model;
export type { Model$Hook, Model$Hooks } from './interfaces';
