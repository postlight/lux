// @flow
import createResponseProxy from './utils/create-response-proxy';

import type { Action } from '../route';
import type { Request, Response } from '../server';

/**
 * Convert traditional node HTTP server middleware into a lux compatible
 * function for use in Controller#beforeAction.
 */
export default function luxify(
  middleware: (
    req: Request,
    res: Response,
    next: (err?: Error) => void
  ) => void
): Action<void|?mixed>{
  const result = function (req, res) {
    return new Promise((resolve, reject) => {
      res = createResponseProxy(res, resolve);

      Reflect.apply(middleware, null, [req, res, (err) => {
        if (err && err instanceof Error) {
          reject(err);
        } else {
          resolve();
        }
      }]);
    });
  };

  Reflect.defineProperty(result, 'name', {
    value: middleware.name
  });

  return result;
}
