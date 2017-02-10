// @flow
import { parse as parseURL } from 'url';

import qs from 'qs';

import type Logger from '../../../logger';
import type { Request } from '../../../request';
import * as query from '../../utils/query';
import * as method from '../../utils/method';
import { RequestHeaders } from '../../utils/headers';

type Options = {
  url: string;
  method: string;
  logger: Logger;
  headers: { [key: string]: string };
};

export function create(options: Options): Request {
  const url = parseURL(options.url);
  const headers = new RequestHeaders(options.headers);

  return {
    headers,
    url: { ...url, params: [] },
    logger: options.logger,
    params: query.fromObject(qs.parse(url.query)),
    method: method.resolve(options.method, headers),
    encrypted: url.protocol === 'https:',
    defaultParams: {},
  };
}
