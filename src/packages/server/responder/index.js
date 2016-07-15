// @flow
import normalize from './utils/normalize';

import type { IncomingMessage, ServerResponse } from 'http';

export function createResponder(
  req: IncomingMessage,
  res: ServerResponse
): (data: ?mixed | void) => void {
  return function respond(data: ?mixed | void): void {
    const { normalized, ...meta } = normalize(data);
    let { statusCode } = meta;

    if (statusCode === 200 && req.method === 'POST') {
      statusCode++;
    }

    res.statusCode = statusCode;

    if (typeof normalized === 'string') {
      res.end(normalized);
    } else {
      res.end(JSON.stringify(normalized));
    }
  };
}
