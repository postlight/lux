// @flow
import type { Response } from '../../server';

/**
 * Create a Proxy that will trap typical node middleware callback invocations
 * and route them to the appropriate Promise callback (resolve or reject).
 *
 * @private
 */
export default function createResponseProxy(
  res: Response,
  resolve: (result: mixed) => void
) {
  return new Proxy(res, {
    get(target, key) {
      switch (key) {
        case 'end':
        case 'send':
        case 'json':
          return resolve;

        default:
          return target[key];
      }
    }
  });
}
