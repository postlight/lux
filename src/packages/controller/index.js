import Model from '../database/model';

import insert from '../../utils/insert';

import type { IncomingMessage } from 'http';

import type Database from '../database';
import type Serializer from '../serializer';

/**
 * The `Controller` class is responsible for taking in requests from the outside
 * world and returning the appropriate response.
 *
 * You can think of a `Controller` like a waiter or waitress at a restaurant.
 * A client makes a request to an application, that request is routed to the
 * appropriate `Controller` and then the `Controller` interprets the request
 * and returns data relative to what the client has request.
 */
class Controller {
  /**
   * The number of records to return for the #index action when a `?limit`
   * parameter is not specified.
   *
   * @property defaultPerPage
   * @memberof Controller
   * @instance
   */
  defaultPerPage: number = 25;

  /**
   * @property store
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  store: Database;

  /**
   * @property model
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  model: typeof Model;

  /**
   * @property modelName
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  modelName: string;

  /**
   * @property attributes
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  attributes: Array<string>;

  /**
   * @property relationships
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  relationships: Array<string>;

  /**
   * @property serializer
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  serializer: Serializer;

  /**
   * @property serializers
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  serializers: Map<string, Serializer>;

  /**
   * @property parentController
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  parentController: ?Controller;

  constructor({
    store,
    model,
    serializer,
    serializers = new Map(),
    parentController
  }: {
    store: Database,
    model: ?Model<T>,
    serializer: Serializer,
    serializers: Map<string, Serializer>,
    parentController: ?Controller
  }): Controller {
    let attributes = [];
    let relationships = [];

    if (model && serializer) {
      const { primaryKey, attributeNames, relationshipNames } = model;
      const { attributes: serializedAttributes } = serializer;

      const serializedRelationships = [
        ...serializer.hasOne,
        ...serializer.hasMany
      ];

      attributes = attributeNames.filter(attr => {
        return attr === primaryKey || serializedAttributes.indexOf(attr) >= 0;
      });

      relationships = relationshipNames.filter(relationship => {
        return serializedRelationships.indexOf(relationship) >= 0;
      });

      Object.freeze(attributes);
      Object.freeze(relationships);
    }

    Object.defineProperties(this, {
      model: {
        value: model,
        writable: false,
        enumerable: false,
        configurable: false
      },

      serializer: {
        value: serializer,
        writable: false,
        enumerable: false,
        configurable: false
      },

      store: {
        value: store,
        writable: false,
        enumerable: false,
        configurable: false
      },

      modelName: {
        value: model ? model.modelName : null,
        writable: false,
        enumerable: false,
        configurable: false
      },

      attributes: {
        value: attributes,
        writable: false,
        enumerable: false,
        configurable: false
      },

      relationships: {
        value: relationships,
        writable: false,
        enumerable: false,
        configurable: false
      },

      serializers: {
        value: serializers,
        writable: false,
        enumerable: false,
        configurable: false
      },

      parentController: {
        value: parentController,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }

  /**
   * Whitelisted parameter keys to allow in incoming PATCH and POST requests.
   *
   * For security reasons, parameters passed to controller actions from an
   * incoming request must have their key whitelisted.
   *
   * @example
   * class UsersController extends Controller {
   *   // Do not allow incoming PATCH or POST requests to modify User#isAdmin.
   *   params = [
   *     'name',
   *     'email',
   *     'password',
   *     // 'isAdmin'
   *   ];
   * }
   *
   * @property params
   * @memberof Controller
   * @instance
   */
  get params(): Array<string> {
    return Object.freeze([]);
  }

  set params(value: Array<string>): void {
    if (value && value.length) {
      const params = new Array(value.length);

      insert(params, value);

      Reflect.defineProperty(this, 'params', {
        value: Object.freeze(params),
        writable: false,
        enumerable: true,
        configurable: false
      });
    }
  }

  /**
   * Middleware functions to execute on each request handled by a `Controller`.
   *
   * Middleware functions declared in beforeAction on an `ApplicationController`
   * will be executed before ALL route handlers.
   *
   * @property beforeAction
   * @memberof Controller
   * @instance
   */
  get beforeAction(): Array<Function> {
    return Object.freeze([]);
  }

  set beforeAction(value: Array<Function>): void {
    if (value && value.length) {
      const beforeAction = new Array(value.length);

      insert(beforeAction, value);

      Reflect.defineProperty(this, 'beforeAction', {
        value: Object.freeze(beforeAction),
        writable: false,
        enumerable: true,
        configurable: false
      });
    }
  }

  /**
   * Whitelisted `?sort` parameter values.
   *
   * If you do not override this property all of the attributes of the Model
   * that this Controller represents will be valid.
   *
   * @property sort
   * @memberof Controller
   * @instance
   */
  get sort(): Array<string> {
    return this.attributes;
  }

  set sort(value: Array<string>): void {
    if (value && value.length) {
      const sort = new Array(sort.length);

      insert(sort, value);

      Reflect.defineProperty(this, 'sort', {
        value: Object.freeze(sort),
        writable: false,
        enumerable: true,
        configurable: false
      });
    }
  }

  /**
   * Whitelisted `?filter[{key}]` parameter keys.
   *
   * If you do not override this property all of the attributes of the Model
   * that this Controller represents will be valid.
   *
   * @property filter
   * @memberof Controller
   * @instance
   */
  get filter(): Array<string> {
    return this.attributes;
  }

  set filter(value: Array<string>): void {
    if (value && value.length) {
      const filter = new Array(filter.length);

      insert(filter, value);

      Reflect.defineProperty(this, 'filter', {
        value: Object.freeze(filter),
        writable: false,
        enumerable: true,
        configurable: false
      });
    }
  }

  /**
   * @property middleware
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  get middleware(): Array<Function> {
    const { beforeAction, parentController } = this;
    let middleware;

    if (parentController) {
      const length = beforeAction.length + parentController.beforeAction.length;

      middleware = new Array(length);

      insert(middleware, [
        ...parentController.middleware,
        ...beforeAction
      ]);
    } else {
      middleware = new Array(beforeAction.length);

      insert(middleware, beforeAction);
    }

    return middleware;
  }

  /**
   * Returns a list of `Model` instances that the Controller instance
   * represents.
   *
   * This method supports filtering, sorting, pagination, including
   * relationships, and sparse fieldsets via query parameters.
   *
   * @param  {IncomingMessage} request
   * @param  {ServerResponse} response
   */
  index(req: IncomingMessage): Promise<Array<Model>> {
    const {
      params: {
        sort,
        page,
        filter,
        fields,
        include
      }
    } = req;

    return this.model.select(...fields)
      .include(include)
      .limit(page.size)
      .page(page.number)
      .where(filter)
      .order(...sort);
  }

  /**
   * Returns a single `Model` instance that the Controller instance represents.
   *
   * This method supports including relationships, and sparse fieldsets via
   * query parameters.
   *
   * @param  {IncomingMessage} request
   * @param  {ServerResponse} response
   */
  show(req: IncomingMessage): Promise<?Model> {
    const {
      params: {
        id,
        fields,
        include
      }
    } = req;

    return this.model.find(id)
      .select(...fields)
      .include(include);
  }

  /**
   * Create and return a single `Model` instance that the Controller instance
   * represents.
   *
   * @param  {IncomingMessage} request
   * @param  {ServerResponse} response
   */
  create(req: IncomingMessage): Promise<Model> {
    const {
      params: {
        data: {
          attributes
        }
      }
    } = req;

    return this.model.create(attributes);
  }

  /**
   * Update and return a single `Model` instance that the Controller instance
   * represents.
   *
   * @param  {IncomingMessage} request
   * @param  {ServerResponse} response
   */
  async update(req: IncomingMessage): Promise<?Model> {
    const {
      params: {
        id,

        data: {
          attributes
        }
      }
    } = req;

    const record = await this.model.find(id);

    if (record) {
      await record.update(attributes);
    }

    return record;
  }

  /**
   * Destroy a single `Model` instance that the Controller instance represents.
   *
   * @param  {IncomingMessage} request
   * @param  {ServerResponse} response
   */
  async destroy(req: IncomingMessage): Promise<number> {
    const record = await this.model.find(req.params.id);

    if (record) {
      await record.destroy();
    }

    return 204;
  }

  /**
   * An action handler used for responding to HEAD or OPTIONS requests.
   *
   * @param  {IncomingMessage} request
   * @param  {ServerResponse} response
   * @private
   */
  preflight(): number {
    return 204;
  }
}

export default Controller;
