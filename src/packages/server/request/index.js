// @flow
import { parse as parseURL } from 'url';

import entries from '../../../utils/entries';

import type { Request, Request$opts } from './interfaces';

/**
 * @private
 */
export function createRequest(req: any, {
  logger,
  router
}: Request$opts): Request {
  const url = { ...parseURL(req.url, true), params: [] };
  const headers: Map<string, string> = new Map(entries(req.headers));

  Object.assign(req, {
    url,
    logger,
    headers,
    params: {},
    method: headers.get('x-http-method-override') || req.method
  });

  const route = router.match(req);

  if (route) {
    Object.assign(req, {
      route,
      action: route.action,
      controller: route.controller
    });
  }

  return req;
}

export { REQUEST_METHODS } from './constants';

export { parseRequest } from './parser';
export { default as getDomain } from './utils/get-domain';
