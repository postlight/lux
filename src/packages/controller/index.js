// @flow
import { Model } from '../database';
import { getDomain } from '../server';

import insert from '../../utils/insert';
import findOne from './utils/find-one';
import findMany from './utils/find-many';
import findRelated from './utils/find-related';

import type Database from '../database';
import type Serializer from '../serializer';
import type { Request, Response } from '../server';
import type { Controller$opts } from './interfaces';

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
   * A boolean value representing whether or not a `Controller` has a backing
   * `Model`.
   *
   * @property hasModel
   * @memberof Controller
   * @instance
   */
  hasModel: boolean;

  /**
   * A boolean value representing whether or not a `Controller` has a backing
   * `Serializer`.
   *
   * @property hasSerializer
   * @memberof Controller
   * @instance
   */
  hasSerializer: boolean;

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
   * @property controllers
   * @memberof Controller
   * @instance
   * @readonly
   * @private
   */
  controllers: Map<string, Controller>;

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
    controllers,
    parentController
  }: Controller$opts) {
    const hasModel = Boolean(model);
    const hasSerializer = Boolean(serializer);
    let attributes = [];
    let relationships = [];

    if (hasModel && hasSerializer) {
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

      hasModel: {
        value: hasModel,
        writable: false,
        enumerable: true,
        configurable: false
      },

      modelName: {
        value: hasModel ? model.modelName : '',
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

      hasSerializer: {
        value: hasSerializer,
        writable: false,
        enumerable: true,
        configurable: false
      },

      store: {
        value: store,
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

      controllers: {
        value: controllers,
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
  }

  /**
   * Use this property to let Lux know what custom query parameters you want to
   * allow for this controller.
   *
   * For security reasons, query parameters passed to Controller actions from an
   * incoming request other than sort, filter, and page must have their key
   * whitelisted.
   *
   * @example
   * class UsersController extends Controller {
   *   // Allow the following custom query parameters to be used for this
   *   // Controller's actions.
   *   query = [
   *     'cache'
   *   ];
   * }
   *
   * @property params
   * @memberof Controller
   * @instance
   */
  get query(): Array<string> {
    return Object.freeze([]);
  }

  set query(value: Array<string>): void {
    if (value && value.length) {
      const query = new Array(value.length);

      insert(query, value);

      Reflect.defineProperty(this, 'query', {
        value: Object.freeze(query),
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
      const filter = new Array(value.length);

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
   * @param  {Request} request
   * @param  {Response} response
   */
  index(req: Request) {
    return findMany(req);
  }

  /**
   * Returns a single `Model` instance that the `Controller` instance
   * represents.
   *
   * This method supports including relationships, and sparse fieldsets via
   * query parameters.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  show(req: Request) {
    return findOne(req);
  }

  /**
   * Create and return a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  async create(req: Request, res: Response) {
    const {
      url: {
        pathname
      },

      params: {
        data: {
          attributes,
          relationships
        } = {}
      },

      route: {
        controller: {
          model,
          controllers
        }
      }
    } = req;

    const record = await model.create(attributes);
    const id = Reflect.get(record, model.primaryKey);

    if (relationships) {
      Object.assign(
        record,
        await findRelated(controllers, relationships)
      );

      await record.save(true);
    }

    res.statusCode = 201;
    res.setHeader('Location', `${getDomain(req) + pathname}/${id}`);

    return record;
  }

  /**
   * Update and return a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  async update(req: Request) {
    const record = await findOne(req);

    const {
      params: {
        data: {
          attributes,
          relationships
        } = {}
      },

      route: {
        controller: {
          controllers
        }
      }
    } = req;

    if (record) {
      Object.assign(record, attributes);

      if (relationships) {
        Object.assign(
          record,
          await findRelated(controllers, relationships)
        );

        return await record.save(true);
      } else {
        return record.isDirty ? await record.save() : 204;
      }
    }

    return 404;
  }

  /**
   * Destroy a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  async destroy(req: Request) {
    const record = await findOne(req);

    if (record) {
      await record.destroy();
      return 204;
    }
  }

  /**
   * An action handler used for responding to HEAD or OPTIONS requests.
   *
   * @param  {Request} request
   * @param  {Response} response
   * @private
   */
  preflight() {
    return 204;
  }
}

export default Controller;
export { BUILT_IN_ACTIONS } from './constants';

export type { Controller$opts, Controller$builtIn } from './interfaces';
