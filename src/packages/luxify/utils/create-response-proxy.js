/* @flow */

import type Response from '../../response';

/**
 * Create a Proxy that will trap typical node middleware callback invocations
 * and route them to the appropriate Promise callback (resolve or reject).
 *
 * @private
 */
export default function createResponseProxy(
  res: Response,
  resolve: (result: mixed) => void
): Response {
  return new Proxy(res, {
    get(target, key) {
      switch (key) {
        case 'end':
        case 'send':
        case 'json':
          return resolve;

        default:
          return Reflect.get(target, key);
      }
    }
  });
}
