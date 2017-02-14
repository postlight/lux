// @flow
import { parse as parseURL } from 'url';

import qs from 'qs';

import type Logger from '../../../logger';
import type { Request } from '../../../request';
import * as query from '../../utils/query';
import * as method from '../../utils/method';
import { RequestHeaders } from '../../utils/headers';
import type { ObjectMap } from '../../../../interfaces';

type Options = {
  url: string;
  body?: Object;
  method: string;
  logger: Logger;
  headers: ObjectMap<string>;
};

export function create(options: Options): Request {
  const url = parseURL(options.url);
  const params = query.fromObject(qs.parse(url.query));
  const headers = new RequestHeaders(options.headers);

  if (options.body) {
    Object.assign(params, options.body);
  }

  return {
    params,
    headers,
    url: { ...url, params: [] },
    logger: options.logger,
    method: method.resolve(options.method, headers),
    encrypted: url.protocol === 'https:',
    defaultParams: {},
  };
}
