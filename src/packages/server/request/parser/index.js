// @flow
import type { Request } from '../interfaces';

import parseRead from './utils/parse-read';
import parseWrite from './utils/parse-write';

/**
 * @private
 */
export function parseRequest(req: Request): Promise<Object> {
  switch (req.method) {
    case 'POST':
    case 'PATCH':
      return parseWrite(req).then(params => ({
        ...parseRead(req),
        ...params
      }));

    default:
      return Promise.resolve(parseRead(req));
  }
}
