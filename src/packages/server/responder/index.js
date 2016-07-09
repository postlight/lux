// @flow
import Response from './response';

import normalize from './utils/normalize';

import type { IncomingMessage, ServerResponse } from 'http';

export function resolve(
  req: IncomingMessage,
  res: ServerResponse,
  data: ?mixed | void
): void {
  new Response()
    .once('ready', (stream: Response) => {
      const { normalized, ...meta } = normalize(data);
      let { statusCode } = meta;

      if (statusCode === 200 && req.method === 'POST') {
        statusCode++;
      }

      res.statusCode = statusCode;
      stream.end(normalized);
    })
    .pipe(res);
}

export default {
  resolve
};
