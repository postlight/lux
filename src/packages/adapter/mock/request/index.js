/* @flow */

import * as url from 'url';

import qs from 'qs';

import Request from '../../../request';
import type Logger from '../../../logger';
import * as query from '../../utils/query';
import * as method from '../../utils/method';
import { Headers } from '../../utils/headers';
import type { ObjectMap } from '../../../../interfaces';

type Options = {
  url: string;
  body?: Object;
  method: string;
  logger: Logger;
  headers: ObjectMap<string>;
};

export function create(options: Options): Request {
  const urlData = url.parse(options.url);
  const params = query.fromObject(qs.parse(urlData.query));
  const headers = new Headers(options.headers);

  if (options.body) {
    Object.assign(params, options.body);
  }

  headers.freeze();

  return new Request({
    params,
    headers,
    url: { ...urlData, params: [] },
    logger: options.logger,
    method: method.resolve(options.method, headers),
    encrypted: urlData.protocol === 'https:',
    defaultParams: {},
  });
}
