// @flow
// eslint-disable-next-line no-unused-vars
import { Model, Query } from '../database';
import { line } from '../logger';
import { getDomain } from '../server';
import { freezeProps } from '../freezeable';
import type Serializer from '../serializer';
// eslint-disable-next-line no-duplicate-imports
import type { Request, Response } from '../server';
import type { Thenable } from '../../interfaces';

import findOne from './utils/find-one';
import findMany from './utils/find-many';
import resolveRelationships from './utils/resolve-relationships';

/**
 * @private
 */
export type BeforeAction = (
  request: Request,
  response: Response
) => Promise<any>;

/**
 * @private
 */
export type AfterAction = (
  request: Request,
  response: Response,
  responseData: any
) => Promise<any>;

/**
 * @private
 */
export type Options<T: Model> = {
  model?: ?Class<T>;
  namespace?: string;
  serializer?: Serializer<T>;
};

/**
 * ## Overview
 *
 * The Controller class is responsible for taking in requests from the outside
 * world and returning the appropriate response.
 *
 * Think of a Controller as a server at a restaurant. A client makes a request
 * to an application, that request is routed to the appropriate Controller and
 * then the Controller interprets the request and returns data relative to what
 * the client has request.
 *
 * #### Actions
 *
 * Controller actions are functions that call on a Controller in response to an
 * incoming HTTP request. The job of Controller actions are to return the data
 * that the Lux Application will respond with.
 *
 * There is no special API for Controller actions. They are simply functions
 * that return a value. If an action returns a Query or Promise the resolved
 * value will be used rather than the immediate return value of the action.
 *
 * Below you will find a table showing the different types of responses you can
 * get from different action return values. Keep in mind, Lux is agnostic to
 * whether or not the value is returned synchronously or resolved from a
 * Promise.
 *
 * | Return/Resolved Value        | Response                                   |
 * |------------------------------|--------------------------------------------|
 * | Array<Model> or Model        | Serialized JSON String                     |
 * | Array or Object Literal      | JSON String                                |
 * | String Literal               | Plain Text                                 |
 * | Number Literal               | [HTTP Status Code](https://goo.gl/T2lMc7)  |
 * | true                         | [204 No Content](https://goo.gl/GxKoqz)    |
 * | false                        | [401 Unauthorized](https://goo.gl/60QqCW)  |
 *
 * **Built-In Actions**
 *
 * Built-in actions refer to Controller actions that you get for free when
 * extending the Controller class (show, index, create, update, destroy). These
 * actions are highly optimized to load only the attributes and relationships
 * that are defined in the resolved Serializer for a Controller.
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
 * rarely need to override the default behavior of a built-in action. In the
 * event that you do need to override a built-in action, you have the ability to
 * opt back into the built-in logic by calling the super class.
 *
 * Read actions such as index and show return a Query which allows us to chain
 * methods to the super call. In the following example  we will extend the
 * default behavior of the index action to only match records that meet an
 * additional hard-coded set of conditions. We will still be able to use all of
 * the functionality that the built-in index action provides.
 *
 * ```javascript
 * // app/controllers/posts.js
 * import { Controller } from 'lux-framework';
 *
 * class PostsController extends Controller {
 *    index(request, response) {
 *      return super.index(request, response).where({
 *        isPublic: true
 *      });
 *    }
 *  }
 *
 *  export default PostsController;
 * ```
 *
 * **Custom Actions**
 *
 * Sometimes it is necessary to add a custom action to a Controller. Lux allows
 * you to do so by adding an instance method to a Controller. In the following
 * example you will see how to add a custom action with the name `check` to a
 * Controller. We are implementing this action to use as a health check for the
 * application so we want to return the `Number` literal `204`.
 *
 * ```javascript
 * // app/controllers/health.js
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
 * // app/controllers/health.js
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
 * to using an Arrow `Function` for a Controller action, such as not being able
 * to call the `super class`. This can be an issue if you are looking to extend
 * a built-in action.
 *
 * Another use case for a custom action could be to return a specific scope of
 * data from a `Model`. Let's implement
 * a custom `drafts` route on a `PostsController`.
 *
 * ```javascript
 * // app/controllers/posts.js
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
 * logic that we get for free with built-in actions. Since we aren't getting too
 * crazy with our custom action we can likely just call the `index` action and
 * chain a `.where()` to it.
 *
 * ```javascript
 * // app/controllers/posts.js
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
 * #### Middleware
 *
 * Middleware can be a very powerful tool in many Node.js server frameworks. Lux
 * is no exception. Middleware can be used to execute logic before or after a
 * Controller action is executed.
 *
 * There are two hooks where you can execute middleware functions,
 * `beforeAction` and `afterAction`. Functions added to the `beforeAction` hook
 * will execute before the Controller action and functions added to the
 * `afterAction` hook will be executed after the `Controller` action.
 *
 * **Context**
 *
 * Middleware functions will be bound to the Controller they are added to upon
 * the start of an Application.
 *
 * Due to the lexical binding of arrow functions, if you need to use the `this`
 * keyword within a middleware function, declare the middleware function using
 * the `function` keyword and not as an arrow function.
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
 * **Execuation Order**
 *
 * Understanding the execution order of middleware functions and a `Controller`
 * action is essential to productivity with Lux. Depending on what you use case
 * is, you may want your function to execute at different times in the
 * `request` / `response` cycle.
 *
 * 1. Parent `Controller` `beforeAction` hooks
 * 2. `Controller` `beforeAction` hooks
 * 3. `Controller` Action
 * 4. `Controller` `afterAction` hooks
 * 5. Parent `Controller` `afterAction` hooks
 *
 * **Modules**
 *
 * It is considered a best practice to define your middleware functions in
 * separate file and export them for use throughout an Application. Typically
 * this is done within an `app/middleware` directory.
 *
 * ```javascript
 * // app/middleware/authenticate.js
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
 * @class Controller
 * @public
 */
class Controller<T: Model> {
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
   * Serializer that represents a Controller's resource. If the Serializer
   * cannot be resolved, this property will default to an empty array.
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
   * Serializer that represents a Controller's resource. If the Serializer
   * cannot be resolved, this property will default to an empty array.
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
   * Serializer that represents a Controller's resource. If the Serializer
   * cannot be resolved, this property will default to an empty array.
   *
   * @property params
   * @type {Array}
   * @default []
   * @public
   */
  params: Array<string> = [];

  /**
   * Functions to execute on each request handled by a `Controller` before the
   * `Controller` action is executed.
   *
   * Functions added to the `beforeAction` hook behave similarly to `Controller`
   * actions, however, they are expected to return `undefined`. If a middleware
   * function returns a value other than `undefined` the `request` / `response`
   * cycle will end before remaining middleware and/or Controller actions are
   * executed. This makes the `beforeAction` hook a very powerful tool for
   * dealing with many common tasks, such as authentication.
   *
   * Functions called from the `beforeAction` hook will have `request` and
   * `response` objects passed as arguements.
   *
   * **Example:**
   *
   * ```javascript
   * import { Controller } from 'lux-framework';
   *
   * const UNSAFE_METHODS = /(?:POST|PATCH|DELETE)/i;
   *
   * function isAdmin(user) {
   *   if (user) {
   *     return user.isAdmin;
   *   }
   *
   *   return false;
   * }
   *
   * async function authentication(request) {
   *   const { method, currentUser } = request;
   *   const isUnsafe = UNSAFE_METHODS.test(method);
   *
   *   if (isUnsafe && !isAdmin(currentUser)) {
   *     return false; // 401 Unauthorized if the current user is not an admin.
   *   }
   * }
   *
   * class PostsController extends Controller {
   *   beforeAction = [
   *     authentication
   *   ];
   * }
   *
   * export default PostsController;
   * ```
   *
   * @property beforeAction
   * @type {Array}
   * @default []
   * @public
   */
  beforeAction: Array<BeforeAction> = [];

  /**
   * Functions to execute on each request handled by a `Controller` after the
   * `Controller` action is executed.
   *
   * Functions called from the `afterAction` hook will have `request` and
   * `response` objects passed as arguments as well as a third `payload`
   * arguements that is a reference to resolved data of the Controller action
   * that was called within the current `request` / `response` cycle. If you
   * return a value from a function added to the `afterAction` hook, that value
   * will be used instead of the resolved data from the preceding Conroller
   * action. Subsequent hooks called from an `afterAction` hook will will use
   * the value returned or resolved from preceding hook. This makes
   * `afterAction` a great place to modify the data you are sending back to the
   * client.
   *
   * **Example:**
   *
   * ```javascript
   * import { Controller } from 'lux-framework';
   *
   * async function addCopyright(request, response, payload) {
   *   const { action } = request;
   *
   *   if (payload && action !== preflight) {
   *     return {
   *       ...payload,
   *       meta: {
   *         copyright: '2016 (c) Postlight'
   *       }
   *     };
   *   }
   *
   *   return payload;
   * }
   *
   * class ApplicationController extends Controller {
   *   afterAction = [
   *     addCopyright
   *   ];
   * }
   *
   * export default ApplicationController;
   * ```
   *
   * @property afterAction
   * @type {Array}
   * @default []
   * @public
   */
  afterAction: Array<AfterAction> = [];

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
   * The resolved Model for a Controller instance.
   *
   * @property model
   * @type {Model}
   * @private
   */
  model: ?Class<T>;

  /**
   * A reference to the root Controller for the namespace that a Controller
   * instance is a member of.
   *
   * @property parent
   * @type {?Controller}
   * @private
   */
  parent: ?Controller<*>;

  /**
   * The namespace that a Controller instance is a member of.
   *
   * @property namespace
   * @type {String}
   * @private
   */
  namespace: string;

  /**
   * The resolved Serializer for a Controller instance.
   *
   * @property serializer
   * @type {Serializer}
   * @private
   */
  serializer: Serializer<*>;

  /**
   * A Map instance containing a reference to all the Controller within an
   * Application instance.
   *
   * @property controllers
   * @type {Map}
   * @private
   */
  controllers: Map<string, Controller<*>>;

  /**
   * A boolean value representing whether or not a Controller instance has a
   * Model.
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
   * Serializer.
   *
   * @property hasSerializer
   * @type {Boolean}
   * @private
   */
  hasSerializer: boolean;

  constructor({ model, namespace, serializer }: Options<T>) {
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
   * This method supports filtering, sorting, pagination, including
   * relationships, and sparse fieldsets via query parameters. For more
   * information, see the [fetching resources](https://goo.gl/q7FVgZ) section of
   * the JSON API specification.
   *
   * @method index
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @return {Promise} Resolves with an array of Model instances.
   * @public
   */
  index(request: Request): Thenable<Array<T>> {
    const { model } = this;

    if (model) {
      return findMany(model, request);
    }

    return Query.resolve([]);
  }

  /**
   * This method supports including relationships, and sparse fieldsets via
   * query parameters. For more information, see the [fetching resources](
   * https://goo.gl/q7FVgZ) section of the JSON API specification.
   *
   * @method show
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @return {Promise} Resolves with a Model instance with the id equal to the
   * id url parameter.
   * @public
   */
  show(request: Request): Thenable<?T> {
    const { model } = this;

    if (model) {
      return findOne(model, request);
    }

    return Promise.resolve(null);
  }

  /**
   * Create and return a single Model instance that the Controller instance
   * represents. For more information, see the [creating resources](
   * https://goo.gl/4Obc9t) section of the JSON API specification.
   *
   * @method create
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @return {Promise} Resolves with the newly created Model instance.
   * @public
   */
  async create(req: Request, res: Response): Promise<T> {
    const { model } = this;

    if (!model) {
      throw new Error(line`
        Controllers without a Model must override the built in "create" action.
      `);
    }

    const {
      url: {
        pathname
      },
      params: {
        data: {
          attributes,
          relationships
        }
      }
    } = req;

    const record = await model.create({
      ...attributes,
      ...resolveRelationships(model, relationships)
    });

    res.setHeader(
      'Location',
      `${getDomain(req) + pathname}/${record.getPrimaryKey()}`
    );

    res.status(201);

    return record.unwrap();
  }

  /**
   * Update and return a single Model instance that the Controller instance
   * represents. For more information, see the [updating resources](
   * https://goo.gl/o2ZdOR)section of the JSON API specification.
   *
   * @method update
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @return {Promise} Resolves with the updated Model if changes occur.
   * Resolves with the number `204` if no changes occur.
   * @public
   */
  update(request: Request): Promise<?(number | T)> {
    const { model } = this;

    if (model) {
      return findOne(model, request)
        .then(record => {
          const {
            params: {
              data: {
                attributes,
                relationships
              }
            }
          } = request;

          return record.update({
            ...attributes,
            ...resolveRelationships(model, relationships)
          });
        })
        .then(record => {
          if (record.didPersist) {
            return record.unwrap();
          }

          return 204;
        });
    }

    return Promise.resolve(null);
  }

  /**
   * Destroy a single Model instance that the Controller instance represents.
   * For more information, see the [deleting resources](https://goo.gl/nUZn8t)
   * section of the JSON API specification.
   *
   * @method destroy
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @return {Promise} Resolves with the number `204`.
   * @public
   */
  destroy(request: Request): Promise<?number> {
    const { model } = this;

    if (model) {
      return findOne(model, request)
        .then(record => record.destroy())
        .then(() => 204);
    }

    return Promise.resolve(null);
  }

  /**
   * Respond to HEAD or OPTIONS requests.
   *
   * @method preflight
   * @param {Request} request - The request object.
   * @param {Response} response - The response object.
   * @return {Promise} Resolves with the number `204`.
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
  Controller$beforeAction,
  Controller$afterAction,
} from './interfaces';
