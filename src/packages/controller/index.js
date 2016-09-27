// @flow
import { Model } from '../database';
import { getDomain } from '../server';
import { freezeProps } from '../freezeable';

import findOne from './utils/find-one';
import findMany from './utils/find-many';
import findRelated from './utils/find-related';

import type Serializer from '../serializer';
import type { Query } from '../database';
import type { Request, Response } from '../server';
import type { Controller$opts, Controller$Middleware } from './interfaces';

/**
 * ## Overview
 *
 * The Controller class is responsible for taking in requests from the outside
 * world and returning the appropriate response.
 *
 * You can think of a Controller like a waiter or waitress at a restaurant.
 * A client makes a request to an application, that request is routed to the
 * appropriate Controller and then the Controller interprets the request
 * and returns data relative to what the client has request.
 *
 * ### Actions
 *
 * Controller actions are functions that called on a Controller in response to
 * an incoming HTTP request. The job of Controller actions are to return the
 * data that should the Lux Application will respond with.
 *
 * There is no special API for Controller actions. They are simply functions
 * that return a value. If an action returns a Query or Promise the resolved
 * value will be used rather than the immediate return value of the action.
 * Below you will find a table showing the diffrent types of responses you can
 * get from different action return values. Keep in mind that Lux is agnostic to
 * wether or not the value is returned syncronously or resolved from a Promise.
 *
 * | Return/Resolved Value        | Response                                   |
 * |------------------------------|--------------------------------------------|
 * | `Array<Model>` or `Model`    | Serialized JSON String                     |
 * | `Array` or `Object` Literal  | JSON String                                |
 * | `String` Literal             | Plain Text                                 |
 * | `Number` Literal             | [HTTP Status Code](https://goo.gl/T2lMc7)  |
 * | `true`                       | [204 No Content](https://goo.gl/GxKoqz)    |
 * | `false`                      | [401 Unauthorized](https://goo.gl/60QqCW)  |
 *
 * **Built-In Actions**
 *
 * Built-in actions refer to the Controller actions that you get for free when
 * extending the Controller class (`show`, `index`, `create`, `update`,
 * `destroy`). These actions are highly optimized to only load the attributes
 * and relationships that are defined in the resolved
 * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} for a Controller.
 *
 * If applicable, built-in actions support the following features described in
 * the [JSON API specification](http://jsonapi.org/):
 *
 * - [Sorting](http://jsonapi.org/format/#fetching-sorting)
 * - [Filtering](http://jsonapi.org/format/#fetching-filtering)
 * - [Pagination](http://jsonapi.org/format/#fetching-pagination)
 * - [Sparse Fieldsets](http://jsonapi.org/format/#fetching-sparse-fieldsets)
 * - [Including Related Resources](http://jsonapi.org/format/#fetching-includes)
 *
 * **Extending Built-In Actions**
 *
 * Considering the amount of functionality built-in actions provide, you will
 * rarely need to overrride the default behavior of a built-in action. In the
 * event that you do need to override a built-in action, you have the ability to
 * opt back into the built-in logic by calling the `super class`.
 *
 * Read actions such as `index` and `show` return a
 * {{#crossLink 'Database.Query'}}Query{{/crossLink}} which allows us to chain
 * methods to the `super` call. In the following example we will extend the
 * default behavior of the `index` action to only match records that meet an
 * additional hard-coded set of conditions. We will still be able to use all of
 * the functionality that the built-in `index` action provides.
 *
 * ```javascript
 * import { Controller } from 'lux-framework';
 *
 * class PostsController extends Controller {
 *   index(request, response) {
 *     return super.index(request, response).where({
 *       isPublic: true
 *     });
 *   }
 * }
 *
 * export default PostsController;
 * ```
 *
 * **Custom Actions**
 *
 * Sometimes it is necessary to add a custom action to a Controller. Lux allows
 * you to do so by adding an instance method to a Controller. In the following
 * example you will see how to add a custom action with the name `check` to a
 * Controller. We are implementing this action to use as a health check for the
 * application so we are going to want to return the `Number` literal `204`.
 *
 * ```javascript
 * import { Controller } from 'lux-framework';
 *
 * class HealthController extends Controller {
 *   async check() {
 *     return 204;
 *   }
 * }
 *
 * export default HealthController;
 * ```
 *
 * The example above is nice but we can make the code a bit more concise with an
 * Arrow `Function`.
 *
 * ```javascript
 * import { Controller } from 'lux-framework';
 *
 * class HealthController extends Controller {
 *   check = async () => 204;
 * }
 *
 * export default HealthController;
 * ```
 *
 * Using an Arrow Function instead of a traditional method Controller can be
 * useful when immediately returning a value. However, there are a few downsides
 * to using an Arrow `Function` for a Controller action such as not being able
 * to call the `super class` which can be an issue if you are looking to extend
 * a built-in action.
 *
 * Another use case for a custom action could be to return a sepecific scope of
 * data from a Model. Let implement a custom `drafts` route on a
 * `PostsController`.
 *
 * ```javacript
 * import { Controller } from 'lux-framework';
 * import Post from 'app/models/posts';
 *
 * class PostsController extends Controller {
 *   drafts() {
 *     return Post.where({
 *       isPublic: false
 *     });
 *   }
 * }
 *
 * export default PostsController;
 * ```
 *
 * While the example above works, we would have to implement all the custom
 * logic that we get for free with built-in actions. Since we aren't getting to
 * crazy with our custom action we can likely just call the `index` action and
 * chain a `.where()` to it.
 *
 * ```javacript
 * import { Controller } from 'lux-framework';
 *
 * class PostsController extends Controller {
 *   drafts(request, response) {
 *     return this.index(request, response).where({
 *       isPublic: false
 *     });
 *   }
 * }
 *
 * export default PostsController;
 * ```
 *
 * Now we can sort, filter, and paginate our custom `drafts` route!
 *
 * ### Middleware
 *
 * Middleware can be a very powerful tool in many Node.js server frameworks. Lux
 * is no exception. Middleware can be used to execute logic before a Controller
 * action is executed.
 *
 * Middleware functions behave similar to Controller actions however, they are
 * expected to return `undefined`. If a middleware function returns a value
 * other than `undefined` the request/response cycle will end before remaining
 * middleware and/or Controller actions are executed. This makes middleware a
 * very powerful tool for dealing with many common tasks such authentication.
 *
 * To add a middleware function simply define an `async` `function` and add it
 * to the `beforeAction` property.
 *
 * ```javascript
 * // app/controllers/posts.js
 * import { Controller } from 'lux-framework';
 *
 * class PostsController extends Controller {
 *   beforeAction = [
 *     async function authenticate(request) {
 *       if (!request.currentUser) {
 *         // 401 Unauthorized
 *         return false;
 *       }
 *     }
 *   ];
 * }
 *
 * export default PostsController;
 * ```
 *
 * **Scoping Middleware**
 *
 * Middleware is scoped by Controller and includes a parent Controller's
 * middleware recursively until the parent Controller is the root
 * `ApplicationController`. This allows you to implement custom logic that can
 * be executed for resources, namespaces, or an entire Application.
 *
 * Let's say we want to require authentication for every route in our
 * Application. All we have to do is move our authentication middleware function
 * from the example above to the `ApplicationController`.
 *
 * ```javascript
 * // app/controllers/application.js
 * import { Controller } from 'lux-framework';
 *
 * class ApplicationController extends Controller {
 *   beforeAction = [
 *     async function authenticate(request) {
 *       if (!request.currentUser) {
 *         // 401 Unauthorized
 *         return false;
 *       }
 *     }
 *   ];
 * }
 *
 * export default ApplicationController;
 * ```
 *
 * **Modules**
 *
 * It is considered a best practice to define your middleware functions in
 * separate file and export them for use throughout an Application. Typically
 * this is done within an `app/middleware` directory.
 *
 * ```javascript
 * // app/middleware/authenticate.js
 *
 * export default async function authenticate(request) {
 *   if (!request.currentUser) {
 *     // 401 Unauthorized
 *     return false;
 *   }
 * }
 * ```
 *
 * This keeps the Controller code clean, easier to read, and easier to modify.
 *
 * ```javascript
 * // app/controllers/application.js
 * import { Controller } from 'lux-framework';
 * import authenticate from 'app/middleware/authenticate';
 *
 * class ApplicationController extends Controller {
 *   beforeAction = [
 *     authenticate
 *   ];
 * }
 *
 * export default ApplicationController;
 * ```
 *
 * ### Security
 *
 * @module lux-framework
 * @namespace Lux
 * @class Controller
 * @constructor
 * @public
 */
class Controller {
  /**
   * An array of custom query parameter keys that are allowed to reach a
   * Controller instance from an incoming `HTTP` request.
   *
   * For security reasons, query parameters passed to Controller actions from an
   * incoming request other than sort, filter, and page must have their key
   * whitelisted.
   *
   * ```javascript
   * class UsersController extends Controller {
   *   // Allow the following custom query parameters to be used for this
   *   // Controller's actions.
   *   query = [
   *     'cache'
   *   ];
   * }
   * ```
   *
   * @property query
   * @type {Array}
   * @default []
   * @public
   */
  query: Array<string> = [];

  /**
   * An array of sort query parameter values that are allowed to reach a
   * Controller instance from an incoming `HTTP` request.
   *
   * If you do not override this property all of the attributes specified in the
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} that represents a
   * Controller's resource. If the {{#crossLink 'Lux.Serializer'}}Serializer
   * {{/crossLink}} cannot be resolved, this property will default to an empty
   * array.
   *
   * @property sort
   * @type {Array}
   * @default []
   * @public
   */
  sort: Array<string> = [];

  /**
   * An array of filter query parameter keys that are allowed to reach a
   * Controller instance from an incoming `HTTP` request.
   *
   * If you do not override this property all of the attributes specified in the
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} that represents a
   * Controller's resource. If the {{#crossLink 'Lux.Serializer'}}Serializer
   * {{/crossLink}} cannot be resolved, this property will default to an empty
   * array.
   *
   * @property filter
   * @type {Array}
   * @default []
   * @public
   */
  filter: Array<string> = [];

  /**
   * An array of parameter keys that are allowed to reach a Controller instance
   * from an incoming `POST` or `PATCH` request body.
   *
   * If you do not override this property all of the attributes specified in the
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} that represents a
   * Controller's resource. If the {{#crossLink 'Lux.Serializer'}}Serializer
   * {{/crossLink}} cannot be resolved, this property will default to an empty
   * array.
   *
   * @property params
   * @type {Array}
   * @default []
   * @public
   */
  params: Array<string> = [];

  /**
   * Middleware functions to execute on each request handled by a Controller.
   *
   * Middleware functions declared in beforeAction on a root Controller will be
   * executed before ALL Controller actions within the root Controller's
   * namespace.
   *
   * @property beforeAction
   * @type {Array}
   * @default []
   * @public
   */
  beforeAction: Array<Controller$Middleware> = [];

  /**
   * The default amount of items to include per each response of the index
   * action if a `?page[size]` query parameter is not specified.
   *
   * @property defaultPerPage
   * @type {Number}
   * @default 25
   * @public
   */
  defaultPerPage: number = 25;

  /**
   * The resolved {{#crossLink 'Lux.Model'}}Model{{/crossLink}} for a Controller
   * instance.
   *
   * @property model
   * @type {Model}
   * @private
   */
  model: Class<Model>;

  /**
   * A reference to the root Controller for the namespace that a Controller
   * instance is a member of.
   *
   * @property parent
   * @type {?Controller}
   * @private
   */
  parent: ?Controller;

  /**
   * The namespace that a Controller instance is a member of.
   *
   * @property namespace
   * @type {String}
   * @private
   */
  namespace: string;

  /**
   * The resolved {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} for a
   * Controller instance.
   *
   * @property serializer
   * @type {Serializer}
   * @private
   */
  serializer: Serializer<*>;

  /**
   * A Map instance containing a reference to all the Controller within a Lux
   * {{#crossLink 'Lux.Application'}}Application{{/crossLink}} instance.
   *
   * @property controllers
   * @type {Map}
   * @private
   */
  controllers: Map<string, Controller>;

  /**
   * A boolean value representing whether or not a Controller instance has a
   * {{#crossLink 'Lux.Model'}}Model{{/crossLink}}.
   *
   * @property hasModel
   * @type {Boolean}
   * @private
   */
  hasModel: boolean;

  /**
   * A boolean value representing whether or not a Controller instance is within
   * a namespace.
   *
   * @property hasNamespace
   * @type {Boolean}
   * @private
   */
  hasNamespace: boolean;

  /**
   * A boolean value representing whether or not a Controller instance has a
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}}.
   *
   * @property hasSerializer
   * @type {Boolean}
   * @private
   */
  hasSerializer: boolean;

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
   * Returns a list of {{#crossLink 'Lux.Model'}}Model{{/crossLink}} instances
   * that the Controller instance represents.
   *
   * This method supports filtering, sorting, pagination, including
   * relationships, and sparse fieldsets via query parameters.
   *
   * @method index
   *
   * @param {Request} request
   *
   * @param {Response} response
   *
   * @return {Query} - Resolves with an array of {{#crossLink 'Lux.Model'}}Model
   * {{/crossLink}} instances.
   *
   * @public
   */
  index(req: Request): Query<Array<Model>> {
    return findMany(req);
  }

  /**
   * Returns a single Model instance that the Controller instance
   * represents.
   *
   * This method supports including relationships, and sparse fieldsets via
   * query parameters.
   *
   * @method show
   *
   * @param {Request} request
   *
   * @param {Response} response
   *
   * @return {Query} - Resolves with a {{#crossLink 'Lux.Model'}}Model
   * {{/crossLink}} instance with the `id` equal to the `id` url parameter.
   *
   * @public
   */
  show(req: Request): Query<Model> {
    return findOne(req);
  }

  /**
   * Create and return a single Model instance that the Controller instance
   * represents.
   *
   * @method create
   * @param {Request} request
   * @param {Response} response
   * @return {Promise}
   * @public
   */
  create(req: Request, res: Response): Promise<Model> {
    const {
      params: {
        data: {
          attributes
        }
      },
      route: {
        controller: {
          model
        }
      }
    } = req;

    return model
      .create(attributes)
      .then(record => {
        const {
          params: {
            data: {
              relationships
            }
          },
          route: {
            controller: {
              controllers
            }
          }
        } = req;

        if (relationships) {
          return findRelated(
            controllers,
            relationships
          ).then(related => {
            Object.assign(record, related);
            return record.save(true);
          });
        } else {
          return record;
        }
      })
      .then(record => {
        const { url: { pathname } } = req;
        const id = record.getPrimaryKey();
        const location = `${getDomain(req) + pathname}/${id}`;

        res.statusCode = 201;
        res.setHeader('Location', location);

        return record;
      });
  }

  /**
   * Update and return a single Model instance that the Controller instance
   * represents.
   *
   * @method update
   * @param {Request} request
   * @param {Response} response
   * @return {Promise}
   * @public
   */
  update(req: Request): Promise<number | Model> {
    return findOne(req).then(record => {
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

        return findRelated(controllers, relationships).then(related => {
          Object.assign(record, related);
          return record.save(true);
        });
      }

      return record.isDirty ? record.save() : 204;
    });
  }

  /**
   * Destroy a single Model instance that the Controller instance
   * represents.
   *
   * @method destroy
   * @param {Request} request
   * @param {Response} response
   * @return {Promise}
   * @public
   */
  destroy(req: Request): Promise<number> {
    return findOne(req)
      .then(record => record.destroy())
      .then(() => 204);
  }

  /**
   * An action handler used for responding to HEAD or OPTIONS requests.
   *
   * @method preflight
   * @param {Request} request
   * @param {Response} response
   * @return {Promise}
   * @public
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
