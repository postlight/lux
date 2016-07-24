// @flow
import { MalformedRequestError } from '../errors';

import { tryCatchSync } from '../../../../../utils/try-catch';
import format from './format';

import type { Request } from '../../interfaces';

export default function parseWrite(req: Request): Promise<Object> {
  return new Promise((resolve, reject) => {
    let body = '';

    const onData = data => {
      body += data.toString();
    };

    const onEnd = () => {
      const parsed = tryCatchSync(() => JSON.parse(body));

      cleanUp();

      if (parsed) {
        resolve(format(parsed, req.method));
      } else {
        reject(new MalformedRequestError());
      }
    };

    const onError = err => {
      cleanUp();
      reject(err);
    };

    const cleanUp = () => {
      req.removeListener('end', onEnd);
      req.removeListener('data', onData);
      req.removeListener('error', onError);
    };

    req.on('data', onData);
    req.once('end', onEnd);
    req.once('error', onError);
  });
}
