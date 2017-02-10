// @flow
import type { AdapterFactory } from '../index';

import * as request from './request';
import * as response from './response';

type Options = {
  url: string;
  method: string;
  headers: { [key: string]: string };
  resolve: Function;
};

const mock: AdapterFactory = ({ logger }) => (
  ({ url, method, resolve, headers }: Options) => (
    Promise.resolve([
      request.create({
        url,
        method,
        logger,
        headers
      }),
      response.create({
        logger,
        resolve,
      }),
    ])
  )
);

export default mock;
