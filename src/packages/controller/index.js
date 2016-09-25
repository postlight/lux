// @flow
import { Model } from '../database';
import { getDomain } from '../server';
import { freezeProps, deepFreezeProps } from '../freezeable';

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
   * Controller's resource. If the
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} cannot be resolved,
   * this property will default to an empty array.
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
   * Controller's resource. If the
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} cannot be resolved,
   * this property will default to an empty array.
   *
   * @property filter
   * @type {Array}
   * @default []
   * @public
   */
  filter: Array<string> = [];

  /**
   * An array of parameter keys that are allowed to reach a
   * Controller instance from an incoming `POST` or `PATCH` request body.
   *
   * If you do not override this property all of the attributes specified in the
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} that represents a
   * Controller's resource. If the
   * {{#crossLink 'Lux.Serializer'}}Serializer{{/crossLink}} cannot be resolved,
   * this property will default to an empty array.
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
   * @type {?Serializer}
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

  modelName: string;

  attributes: Array<string>;

  relationships: Array<string>;

  constructor({ model, namespace, serializer }: Controller$opts) {
    const hasModel = Boolean(model);
    const hasNamespace = Boolean(namespace);
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

    Object.assign(this, {
      model,
      namespace,
      serializer
    });

    freezeProps(this, true,
      'model',
      'namespace',
      'serializer'
    );

    Object.assign(this, {
      hasModel,
      hasNamespace,
      hasSerializer,
      attributes,
      relationships,
      modelName: hasModel ? model.modelName : '',
    });

    deepFreezeProps(this, false,
      'hasModel',
      'hasNamespace',
      'hasSerializer',
      'attributes',
      'relationships',
      'modelName'
    );
  }

  /**
   * Returns a list of `Model` instances that the Controller instance
   * represents.
   *
   * This method supports filtering, sorting, pagination, including
   * relationships, and sparse fieldsets via query parameters.
   *
   * @param {Request} request
   * @param {Response} response
   * @returns {Query<Array<Model>>}
   */
  index(req: Request): Query<Array<Model>> {
    return findMany(req);
  }

  /**
   * Returns a single `Model` instance that the `Controller` instance
   * represents.
   *
   * This method supports including relationships, and sparse fieldsets via
   * query parameters.
   *
   * @param {Request} request
   * @param {Response} response
   * @returns {Query<Model>}
   */
  show(req: Request): Query<Model> {
    return findOne(req);
  }

  /**
   * Create and return a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param {Request} request
   * @param {Response} response
   * @returns {Promise<Model>}
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
   * Update and return a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param {Request} request
   * @param {Response} response
   * @returns {Promise<(number|Model)>}
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
   * Destroy a single `Model` instance that the `Controller` instance
   * represents.
   *
   * @param {Request} request
   * @param {Response} response
   * @returns {Promise<number>}
   */
  destroy(req: Request): Promise<number> {
    return findOne(req)
      .then(record => record.destroy())
      .then(() => 204);
  }

  /**
   * An action handler used for responding to HEAD or OPTIONS requests.
   *
   * @param {Request} request
   * @param {Response} response
   * @returns {Promise<number>}
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
