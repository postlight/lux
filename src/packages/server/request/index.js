// @flow
import { parse as parseURL } from 'url';

import entries from '../../../utils/entries';

import type { Request, Request$opts } from './interfaces';

/**
 * @typedef {Object} Request
 * @property {Map<string, string>} headers
 * @property {string} httpVersion
 * @property {string} method
 * @property {Logger} logger
 * @property {Object} params
 * @property {Object} defaultParams
 * @property {Route} route
 * @property {Object} url
 */

/**
 * @private
 */
export function createRequest(req: any, {
  logger,
  router
}: Request$opts): Request {
  const url = parseURL(req.url, true);
  const headers: Map<string, string> = new Map(entries(req.headers));

  Object.assign(req, {
    url,
    logger,
    headers,
    params: {},
    method: headers.get('x-http-method-override') || req.method
  });

  Reflect.set(req, 'route', router.match(req));

  return req;
}

export { REQUEST_METHODS } from './constants';

export { parseRequest } from './parser';
export { default as getDomain } from './utils/get-domain';
