// @flow
import { ID_PATTERN } from './constants';

import { FreezeableSet, freezeProps, deepFreezeProps } from '../../freezeable';

import { createAction } from './action';
import { paramsFor, defaultParamsFor, validateResourceId } from './params';

import getStaticPath from './utils/get-static-path';
import getDynamicSegments from './utils/get-dynamic-segments';

import type Controller from '../../controller';
import type { Request, Response, Request$method } from '../../server';
import type { Action } from './action';
import type { ParameterGroup } from './params';
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

  parseParams(pathname: string) {
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

  async execHandlers(req: Request, res: Response): Promise<any> {
    for (const handler of this) {
      const data = await handler(req, res);

      if (typeof data !== 'undefined') {
        return data;
      }
    }
  }

  async visit(req: Request, res: Response): Promise<any> {
    const { defaultParams } = this;

    Object.assign(req, {
      defaultParams,
      params: this.params.validate({
        ...req.params,
        ...this.parseParams(req.url.pathname)
      })
    });

    if (this.type === 'member' && req.method === 'PATCH') {
      validateResourceId(req);
    }

    return await this.execHandlers(req, res);
  }
}

export default Route;
export { ID_PATTERN, DYNAMIC_PATTERN, RESOURCE_PATTERN } from './constants';

export type { Action } from './action';
export type { Route$opts, Route$type } from './interfaces';
