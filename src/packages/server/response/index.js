// @flow
import type { Response, Response$opts } from './interfaces';

/**
 * @typedef {Object} Response
 * @property {Array<Object>} stats
 * @property {Logger} logger
 * @property {number} statusCode
 * @property {string} statusMessage
 */

/**
 * @private
 */
export function createResponse(res: any, opts: Response$opts): Response {
  return Object.assign(res, opts, {
    stats: []
  });
}
