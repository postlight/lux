// @flow
import { Model } from '../database';
import { getDomain } from '../server';

import merge from '../../utils/merge';
import insert from '../../utils/insert';
import paramsToQuery from './utils/params-to-query';

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
    serializers,
    parentController
  }: Controller$opts) {
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
        value: model ? model.modelName : '',
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
  index({
    params,
    defaultParams,

    route: {
      controller: {
        model
      }
    }
  }: Request): Promise<Array<Model>> {
    const {
      sort,
      page,
      limit,
      select,
      filter,
      include
    } = paramsToQuery(model, merge(defaultParams, params));

    return model.select(...select)
      .include(include)
      .limit(limit)
      .page(page)
      .where(filter)
      .order(...sort);
  }

  /**
   * Returns a single `Model` instance that the Controller instance represents.
   *
   * This method supports including relationships, and sparse fieldsets via
   * query parameters.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  show({
    params,
    defaultParams,

    route: {
      controller: {
        model
      }
    }
  }: Request): Promise<?Model> {
    const {
      id,
      select,
      include
    } = paramsToQuery(model, merge(defaultParams, params));

    return model.find(id)
      .select(...select)
      .include(include);
  }

  /**
   * Create and return a single `Model` instance that the Controller instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  async create(req: Request, res: Response): Promise<Model> {
    const {
      url: {
        pathname
      },

      params: {
        data: {
          attributes
        } = {}
      },

      route: {
        controller: {
          model
        }
      }
    } = req;

    const record = await model.create(attributes);
    const id = Reflect.get(record, model.primaryKey);

    res.statusCode = 201;
    res.setHeader('Location', `${getDomain(req) + pathname}/${id}`);

    return record;
  }

  /**
   * Update and return a single `Model` instance that the Controller instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  async update({
    params: {
      id,

      data: {
        attributes
      } = {}
    },

    route: {
      controller: {
        model
      }
    }
  }: Request): Promise<number|Model> {
    const record = await model.find(id);

    if (record) {
      Object.assign(record, attributes);
      return record.isDirty ? await record.save() : 204;
    }

    return 404;
  }

  /**
   * Destroy a single `Model` instance that the Controller instance represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  async destroy({
    params: {
      id
    },

    route: {
      controller: {
        model
      }
    }
  }: Request): Promise<void|number> {
    const record = await model.find(id);

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
  preflight(): number {
    return 204;
  }
}

export default Controller;
