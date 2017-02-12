// @flow
import type { AdapterFactory } from '../index';
import type { ObjectMap } from '../../../interfaces';

import * as request from './request';
import * as response from './response';

type Options = {
  url: string;
  body?: Object;
  method: string;
  headers: ObjectMap;
  resolve: Function;
};

const mock: AdapterFactory = ({ logger }) => (
  ({ url, body, method, resolve, headers }: Options) => (
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
