// @flow
import type { ServerResponse } from 'http';

import { ResponseHeaders } from '../../utils/headers';
import type Logger from '../../../logger';
import type { Response } from '../../../response';

export function create(res: ServerResponse, logger: Logger): Response {
  const send = (data: string) => res.end(data);
  const headers = new ResponseHeaders((type, [key, value]) => {
    if (type === 'SET' && value) {
      res.setHeader(key, value);
    } else if (type === 'DELETE') {
      res.removeHeader(key);
    }
  });

  const response = {
    send,
    logger,
    headers,
    end: send,
    stats: [],
    status: (code: number) => {
      // eslint-disable-next-line no-param-reassign
      res.statusCode = code;
      return response;
    },
    getHeader: key => res.getHeader(key),
    setHeader: (key, value) => res.setHeader(key, value),
    removeHeader: key => res.removeHeader(key),
    statusCode: 200,
    statusMessage: 'OK',
  };

  return response;
}
