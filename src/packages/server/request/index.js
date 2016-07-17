// @flow
import { parse as parseURL } from 'url';

import entries from '../../../utils/entries';
import { defaultParamsFor } from '../../controller';

import type { Request, Request$opts } from './interfaces';

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

  const route = router.match(req);

  if (route) {
    const { pathname } = url;
    let params = {};

    if (pathname) {
      params = route.parseParams(pathname);
    }

    Object.assign(req, {
      route,
      params,
      defaultParams: defaultParamsFor(route.controller, route.action)
    });
  }

  return req;
}

export { default as formatParams } from './utils/format-params';
