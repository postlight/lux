// @flow
import { FreezeableSet, freezeProps, deepFreezeProps } from '../../freezeable';
import type Controller from '../../controller';
import type { Request, Response, Request$method } from '../../server';

import { FINAL_HANDLER, createAction } from './action';
import { paramsFor, defaultParamsFor, validateResourceId } from './params';
import getStaticPath from './utils/get-static-path';
import getDynamicSegments from './utils/get-dynamic-segments';
import type { Action } from './action'; // eslint-disable-line max-len, no-duplicate-imports
import type { ParameterGroup } from './params'; // eslint-disable-line max-len, no-duplicate-imports
import type { Route$opts } from './interfaces';

/**
 * @private
 */
class Route extends FreezeableSet<Action<any>> {
  type: string;

  path: string;

  action: string;

  params: ParameterGroup;

  method: Request$method;

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
  }: Route$opts) {
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
        'Arguements `controller` and `action`  must not be undefined'
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
      data = await handler(req, res, data);

      if (handler.name === FINAL_HANDLER) {
        calledFinal = true;
      }

      if (!calledFinal && typeof data !== 'undefined') {
        break;
      }
    }

    return data;
  }

  async visit(req: Request, res: Response): Promise<any> {
    const { defaultParams } = this;

    Object.assign(req, {
      defaultParams,
      params: this.params.validate({
        ...req.params,
        ...this.parseParams(req.url.params)
      })
    });

    if (this.type === 'member' && req.method === 'PATCH') {
      validateResourceId(req);
    }

    return await this.execHandlers(req, res);
  }
}

export default Route;
export { DYNAMIC_PATTERN } from './constants';

export type { Action } from './action';
export type { Route$opts, Route$type } from './interfaces';
