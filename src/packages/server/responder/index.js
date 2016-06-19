// @flow
import Response from './response';

import normalize from './utils/normalize';

import type { ServerResponse } from 'http';

export function resolve(res: ServerResponse, data: ?mixed | void): void {
  new Response()
    .once('ready', (stream: Response) => {
      const {
        normalized,
        statusCode
      } = normalize(data);

      res.statusCode = statusCode;
      stream.end(normalized);
    })
    .pipe(res);
}

export default {
  resolve
};
