// @flow
import { ID_PATTERN, RESOURCE_PATTERN } from './constants';

import { FreezeableSet } from '../freezeable';

import { createAction } from './action';
import { paramsFor, defaultParamsFor } from './params';

import getStaticPath from './utils/get-static-path';
import getDynamicSegments from './utils/get-dynamic-segments';

import type Controller from '../controller';
import type { Request, Response, Request$method } from '../server';
import type { Route$opts } from './interfaces';
import type { Action } from './action';
import type { ParameterGroup } from './params';

/**
 * @private
 */
class Route extends FreezeableSet<Action<any>> {
  path: string;

  params: ParameterGroup;

  action: string;

  method: Request$method;

  resource: string;

  controller: Controller;

  staticPath: string;

  dynamicSegments: Array<string>;

  constructor({
    path,
    action,
    method,
    controllers
  }: Route$opts) {
    const [resource] = path.match(RESOURCE_PATTERN) || [path];
    const controller: ?Controller = controllers.get(resource);
    const dynamicSegments = getDynamicSegments(path);

    if (action && controller) {
      const handler = Reflect.get(controller, action);

      if (typeof handler === 'function') {
        const params = paramsFor({
          method,
          controller,
          dynamicSegments
        });

        super(createAction(action, controller, handler));

        Object.defineProperties(this, {
          path: {
            value: path,
            writable: false,
            enumerable: true,
            configurable: false
          },

          params: {
            value: params,
            writable: false,
            enumerable: false,
            configurable: false
          },

          action: {
            value: action,
            writable: false,
            enumerable: true,
            configurable: false
          },

          method: {
            value: method,
            writable: false,
            enumerable: true,
            configurable: false
          },

          resource: {
            value: resource,
            writable: false,
            enumerable: false,
            configurable: false
          },

          controller: {
            value: controller,
            writable: false,
            enumerable: false,
            configurable: false
          },

          dynamicSegments: {
            value: dynamicSegments,
            writable: false,
            enumerable: false,
            configurable: false
          },

          staticPath: {
            value: getStaticPath(path, dynamicSegments),
            writable: false,
            enumerable: false,
            configurable: false
          }
        });
      } else {
        const {
          constructor: {
            name: controllerName
          }
        } = controller;

        throw new TypeError(
          `Handler for ${controllerName}#${action} is not a function.`
        );
      }
    } else {
      throw new TypeError(
        'Arguements `controller` and `action`  must not be undefined'
      );
    }

    return this.freeze();
  }

  parseParams(pathname: string): Object {
    const parts = pathname.match(ID_PATTERN) || [];

    return parts.reduce((params, val, index) => {
      const key = this.dynamicSegments[index];

      if (key) {
        params = {
          ...params,
          [key]: parseInt(val, 10)
        };
      }

      return params;
    }, {});
  }

  getDefaultParams(): Object {
    const { action, controller } = this;

    return defaultParamsFor({
      action,
      controller
    });
  }

  async execHandlers(req: Request, res: Response): Promise<any> {
    for (const handler of this) {
      const data = await handler(req, res);

      if (typeof data !== 'undefined') {
        return data;
      }
    }
  }

  visit(req: Request, res: Response): Promise<any> {
    Object.assign(req, {
      defaultParams: this.getDefaultParams(),

      params: {
        ...req.params,
        ...this.parseParams(req.url.pathname)
      }
    });

    this.params.validate(req.params);

    return this.execHandlers(req, res);
  }
}

export default Route;
export { ID_PATTERN, RESOURCE_PATTERN } from './constants';

export type { Action } from './action';
export type { Route$opts } from './interfaces';
