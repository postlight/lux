// @flow
import { parse as parseQueryString } from 'querystring';

import type { Request } from '../interfaces';

export default function bodyParser(req: Request): Promise<Object> {
  return new Promise((resolve, reject) => {
    let body = '';

    const onData = data => {
      body += data.toString();
    };

    const onEnd = () => {
      body = (req.headers.get('content-type') || '').includes('json') ?
        JSON.parse(body) : parseQueryString(body);

      cleanUp();
      resolve(body);
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
