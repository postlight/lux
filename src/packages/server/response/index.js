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
  const response = res;

  return Object.assign(response, opts, {
    stats: [],

    status(value: number): Response {
      response.statusCode = value;
      return response;
    }
  });
}
