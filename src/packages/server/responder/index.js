// @flow
import ContentStream from '../../content-stream';

import normalize from './utils/normalize';

import type { ServerResponse } from 'http';

export function resolve(res: ServerResponse, data: ?mixed | void): void {
  new ContentStream()
    .once('ready', (stream: ContentStream) => {
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
