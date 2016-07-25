// @flow
import parseRead from './utils/parse-read';
import parseWrite from './utils/parse-write';

import type { Request } from '../interfaces';

/**
 * @private
 */
export function parseRequest(req: Request): Promise<Object> {
  switch (req.method) {
    case 'GET':
    case 'HEAD':
    case 'OPTIONS':
      return Promise.resolve(parseRead(req));

    case 'POST':
    case 'PATCH':
      return parseWrite(req);

    default:
      return Promise.resolve({});
  }
}
