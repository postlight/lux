// @flow
import { MalformedRequestError } from '../errors';
import { tryCatchSync } from '../../../../../utils/try-catch';
import type { Request } from '../../interfaces';

import format from './format';

function getLength(req: Request): number {
  const contentLength = req.headers.get('content-length');

  if (contentLength) {
    const length = Number.parseInt(contentLength, 10);

    if (Number.isFinite(length)) {
      return length;
    }
  }

  return 0;
}

/**
 * @private
 */
export default function parseWrite(req: Request): Promise<Object> {
  return new Promise((resolve, reject) => {
    const body = Buffer.allocUnsafe(getLength(req));
    let offset = 0;

    const handleData = data => {
      data.copy(body, offset);
      offset = offset + data.length;
    };

    const handleEnd = () => {
      const parsed = tryCatchSync(() => JSON.parse(body.toString()));

      // eslint-disable-next-line no-use-before-define
      req.removeListener('error', handleError);
      req.removeListener('data', handleData);
      req.removeListener('end', handleEnd);

      if (parsed) {
        resolve(format(parsed, req.method));
      } else {
        reject(new MalformedRequestError());
      }
    };

    const handleError = () => {
      req.removeListener('error', handleError);
      req.removeListener('data', handleData);
      req.removeListener('end', handleEnd);
    };

    req.on('data', handleData);
    req.once('end', handleEnd);
    req.once('error', handleError);
  });
}
