// @flow
import type { Response, Response$opts } from './interfaces';

/**
 * @private
 */
export function createResponse(res: any, opts: Response$opts): Response {
  return Object.assign(res, opts, {
    stats: []
  });
}
