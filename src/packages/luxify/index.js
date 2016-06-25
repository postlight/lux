// @flow
import createResponseProxy from './utils/create-response-proxy';
import type { IncomingMessage, ServerResponse } from 'http';

/**
 * Convert traditional node HTTP server middleware into a lux compatible
 * function for use in Controller#beforeAction.
 */
export default function luxify(
  middleware: (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: Error) => void
  ) => void
): (req: IncomingMessage, res: ServerResponse) => Promise<void|mixed> {
  const result = function (req, res) {
    return new Promise((resolve, reject) => {
      res = createResponseProxy(res, resolve);

      middleware.call(null, req, res, (err) => {
        if (err && err instanceof Error) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  };

  Object.defineProperty(result, 'name', {
    value: middleware.name
  });

  return result;
}
