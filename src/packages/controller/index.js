// @flow
import { Model } from '../database';
import { getDomain } from '../server';
import { freezeProps } from '../freezeable';
import type Serializer from '../serializer';
import type { Query } from '../database'; // eslint-disable-line max-len, no-duplicate-imports
import type { Request, Response } from '../server'; // eslint-disable-line max-len, no-duplicate-imports

import findOne from './utils/find-one';
import findMany from './utils/find-many';
import findRelated from './utils/find-related';
import type { Controller$opts, Controller$Middleware } from './interfaces';

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
   * @property model
   * @memberof Controller
   * @instance
   */
  model: Class<Model>;

  /**
   * @property parent
   * @memberof Controller
   * @instance
   */
  parent: ?Controller;

  /**
   * The namespace that a `Controller` instance is a member of.
   *
   * @property namespace
   * @memberof Controller
   * @instance
   */
  namespace: string;

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
  query: Array<string> = [];

  /**
   * Whitelisted `?sort` parameter values.
   *
   * If you do not override this property all of the attributes specified in an
   * instance's `Serializer` will be whitelisted.
   *
   * @property sort
   * @memberof Controller
   * @instance
   */
  sort: Array<string> = [];

  /**
   * Whitelisted `?filter[{key}]` parameter keys.
   *
   * If you do not override this property all of the attributes specified in an
   * instance's `Serializer` will be whitelisted.
   *
   * @property filter
   * @memberof Controller
   * @instance
   */
  filter: Array<string> = [];

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
  params: Array<string> = [];

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
  beforeAction: Array<Controller$Middleware> = [];

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
   * A boolean value representing whether or not a `Controller` has a backing
   * `Model`.
   *
   * @property hasModel
   * @memberof Controller
   * @instance
   * @private
   */
  hasModel: boolean;

  /**
   * A boolean value representing whether or not a `Controller` is a member of
   * a namespace.
   *
   * @property hasNamespace
   * @memberof Controller
   * @instance
   * @private
   */
  hasNamespace: boolean;

  /**
   * A boolean value representing whether or not a `Controller` has a backing
   * `Serializer`.
   *
   * @property hasSerializer
   * @memberof Controller
   * @instance
   * @private
   */
  hasSerializer: boolean;

  /**
   * @property serializer
   * @memberof Controller
   * @instance
   * @private
   */
  serializer: Serializer<*>;

  /**
   * @property controllers
   * @memberof Controller
   * @instance
   * @private
   */
  controllers: Map<string, Controller>;

  constructor({ model, namespace, serializer }: Controller$opts) {
    Object.assign(this, {
      model,
      namespace,
      serializer,
      hasModel: Boolean(model),
      hasNamespace: Boolean(namespace),
      hasSerializer: Boolean(serializer)
    });

    freezeProps(this, true,
      'model',
      'namespace',
      'serializer'
    );

    freezeProps(this, false,
      'hasModel',
      'hasNamespace',
      'hasSerializer'
    );
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
  index(req: Request): Query<Array<Model>> {
    return findMany(this.model, req);
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
  show(req: Request): Query<Model> {
    return findOne(this.model, req);
  }

  /**
   * Create and return a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  create(req: Request, res: Response): Promise<Model> {
    const {
      params: {
        data: {
          attributes,
          relationships
        }
      }
    } = req;

    return this.model
      .create(attributes)
      .then(record => {
        if (relationships) {
          return findRelated(this.controllers, relationships).then(related => {
            Object.assign(record, related);
            return record.save(true);
          });
        }

        return record;
      })
      .then(record => {
        const { url: { pathname } } = req;
        const id = record.getPrimaryKey();

        res.statusCode = 201; // eslint-disable-line no-param-reassign
        res.setHeader('Location', `${getDomain(req) + pathname}/${id}`);

        return record;
      });
  }

  /**
   * Update and return a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  update(req: Request): Promise<number | Model> {
    return findOne(this.model, req).then(record => {
      const {
        params: {
          data: {
            attributes,
            relationships
          }
        }
      } = req;

      Object.assign(record, attributes);

      if (relationships) {
        const {
          route: {
            controller: {
              controllers
            }
          }
        } = req;

        return findRelated(
          controllers,
          relationships
        ).then(related => {
          Object.assign(record, related);
          return record.save(true);
        });
      }

      return record.isDirty ? record.save() : 204;
    });
  }

  /**
   * Destroy a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param  {Request} request
   * @param  {Response} response
   */
  destroy(req: Request): Promise<number> {
    return findOne(this.model, req)
      .then(record => record.destroy())
      .then(() => 204);
  }

  /**
   * An action handler used for responding to HEAD or OPTIONS requests.
   *
   * @param  {Request} request
   * @param  {Response} response
   * @private
   */
  preflight(): Promise<number> {
    return Promise.resolve(204);
  }
}

export default Controller;
export { BUILT_IN_ACTIONS } from './constants';

export type {
  Controller$opts,
  Controller$builtIn,
  Controller$Middleware,
} from './interfaces';
