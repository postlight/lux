// @flow
import type { AdapterFactory } from '../index';
import type { ObjectMap } from '../../../interfaces';

import * as request from './request';
import * as response from './response';

type Options = {
  url: string;
  body?: Object;
  method: string;
  headers: ObjectMap<string>;
  resolve?: (data: any) => void;
};

const mock: AdapterFactory = ({ logger }) => (
  ({ url, body, method, headers, resolve }: Options) => (
    Promise.resolve([
      request.create({
        url,
        body,
        method,
        logger,
        headers,
      }),
      response.create({
        logger,
        resolve,
      }),
    ])
  )
);

export default mock;
export { request, response };
