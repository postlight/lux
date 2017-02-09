// @flow
import { FreezeableSet, freezeProps, deepFreezeProps } from '../../freezeable';
import { tryCatchSync } from '../../../utils/try-catch';
import type Controller from '../../controller';
import type { Request, Response, Request$method } from '../../server';

import { createAction } from './action';
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

  handlers: Array<Action<any>>;

  controller: Controller<*>;

  staticPath: string;

  actionIndex: number;

  defaultParams: Object;

  dynamicSegments: Array<string>;

  constructor({
    type,
    path,
    action,
    method,
    controller
  }: Route$opts) {
    // $FlowIgnore
    const handler = controller[action];

    if (typeof handler !== 'function') {
      const {
        constructor: {
          name: controllerName
        }
      } = controller;

      throw new TypeError(
        `Handler for ${controllerName}#${action} is not a function.`
      );
    }

    const dynamicSegments = getDynamicSegments(path);
    const staticPath = getStaticPath(path, dynamicSegments);

    const params = paramsFor({
      type,
      method,
      controller,
      dynamicSegments
    });

    const defaultParams = defaultParamsFor({
      type,
      controller
    });

    const handlers = createAction(type, handler, controller);

    super(handlers);

    Object.assign(this, {
      type,
      path,
      params,
      action,
      method,
      handlers,
      controller,
      staticPath,
      defaultParams,
      dynamicSegments,
      actionIndex: controller.beforeAction.length
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

  execHandlers(req: Request, res: Response): Promise<any> {
    let result = Promise.resolve();
    let calledFinal = false;
    let shouldContinue = true;
    const { handlers, actionIndex } = this;

    const step = (prev, nextIdx) => prev.then(data => {
      if (!calledFinal && typeof data !== 'undefined') {
        shouldContinue = false;
        return prev;
      }

      return handlers[nextIdx](req, res, data);
    });

    for (let i = 0; i < handlers.length; i = i + 1) {
      if (!shouldContinue) {
        break;
      }

      result = step(result, i);

      if (i === actionIndex) {
        calledFinal = true;
      }
    }

    return result;
  }

  visit(req: Request, res: Response): Promise<any> {
    let error;

    tryCatchSync(() => {
      const { defaultParams } = this;
      let params = {
        ...req.params,
        ...this.parseParams(req.url.params)
      };

      if (req.method !== 'OPTIONS') {
        params = this.params.validate(params);
      }

      Object.assign(req, {
        params,
        defaultParams
      });

      if (this.type === 'member' && req.method === 'PATCH') {
        validateResourceId(req);
      }
    }, err => {
      error = err;
    });

    if (error) {
      return Promise.reject(error);
    }

    return this.execHandlers(req, res);
  }
}

export default Route;
export { DYNAMIC_PATTERN } from './constants';

export type { Action } from './action';
export type { Route$opts, Route$type } from './interfaces';
