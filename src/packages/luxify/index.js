// @flow
import type { Action } from '../router';
import type { Request, Response } from '../server';

import createResponseProxy from './utils/create-response-proxy';

/**
 * Convert traditional node HTTP server middleware into a lux compatible
 * function for use in Controller#beforeAction.
 *
 * @module lux-framework
 * @namespace Lux
 * @function luxify
 */
export default function luxify(
  middleware: (
    req: Request,
    res: Response,
    next: (err?: Error) => void
  ) => void
): Action<any> {
  const result = function (req, res) { // eslint-disable-line func-names
    return new Promise((resolve, reject) => {
      Reflect.apply(middleware, null, [
        req,
        createResponseProxy(res, resolve),
        (err) => {
          if (err && err instanceof Error) {
            reject(err);
          } else {
            resolve();
          }
        }
      ]);
    });
  };

  Reflect.defineProperty(result, 'name', {
    value: middleware.name
  });

  return result;
}
