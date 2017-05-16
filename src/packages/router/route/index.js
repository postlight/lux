/* @flow */

import { FreezeableSet, freezeProps, deepFreezeProps } from '../../freezeable';
import type Controller from '../../controller';
import type Request, { Method } from '../../request';
import type Response from '../../response';

import { createAction } from './action';
import { paramsFor, defaultParamsFor, validateResourceId } from './params';
import getStaticPath from './utils/get-static-path';
import getDynamicSegments from './utils/get-dynamic-segments';
// eslint-disable-next-line no-duplicate-imports
import type { Action } from './action';
// eslint-disable-next-line no-duplicate-imports
import type { ParameterGroup } from './params';

export type Type =
  | 'custom'
  | 'member'
  | 'collection';

export type Options = {
  type: Type;
  path: string;
  action: string;
  method: Method;
  controller: Controller;
};

/**
 * @private
 */
class Route extends FreezeableSet<Action<any>> {
  type: string;

  path: string;

  action: string;

  params: ParameterGroup;

  method: Method;

  controller: Controller;

  staticPath: string;

  defaultParams: Object;

  dynamicSegments: Array<string>;

  constructor({
    type,
    path,
    action,
    method,
    controller
  }: Options) {
    const dynamicSegments = getDynamicSegments(path);

    if (action && controller) {
      const handler = Reflect.get(controller, action);

      if (typeof handler === 'function') {
        const params = paramsFor({
          type,
          method,
          controller,
          dynamicSegments
        });

        const staticPath = getStaticPath(path, dynamicSegments);

        const defaultParams = defaultParamsFor({
          type,
          controller
        });

        super(createAction(type, handler, controller));

        Object.assign(this, {
          type,
          path,
          params,
          action,
          method,
          controller,
          staticPath,
          defaultParams,
          dynamicSegments
        });

        freezeProps(this, true,
          'type',
          'path'
        );

        freezeProps(this, false,
          'action',
          'params',
          'method',
          'controller',
          'staticPath'
        );

        deepFreezeProps(this, false,
          'defaultParams',
          'dynamicSegments'
        );
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
        'Arguments `controller` and `action` must not be undefined'
      );
    }

    this.freeze();
  }

  parseParams(params: Array<string>): Object {
    return params.reduce((result, value, idx) => {
      const key = this.dynamicSegments[idx];

      if (key) {
        return {
          ...result,
          [key]: Number.parseInt(value, 10)
        };
      }

      return result;
    }, {});
  }

  async execHandlers(req: Request, res: Response): Promise<any> {
    let calledFinal = false;
    let data;

    for (const handler of this) {
      // eslint-disable-next-line no-await-in-loop
      data = await handler(req, res, data);

      if (handler.isFinal) {
        calledFinal = true;
      }

      if (!calledFinal && typeof data !== 'undefined') {
        break;
      }
    }

    return data;
  }

  async visit(request: Request, response: Response): Promise<any> {
    const { defaultParams } = this;
    let params = {
      ...request.params,
      ...this.parseParams(request.url.params)
    };

    if (request.method !== 'OPTIONS') {
      params = this.params.validate(params);
    }

    Object.assign(request, {
      params,
      defaultParams,
    });

    if (this.type === 'member' && request.method === 'PATCH') {
      validateResourceId(request);
    }

    return this.execHandlers(request, response);
  }
}

export default Route;
export { DYNAMIC_PATTERN } from './constants';

export type { Action } from './action';
export type { Route$opts, Route$type } from './interfaces';
