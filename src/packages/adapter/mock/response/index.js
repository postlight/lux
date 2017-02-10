// @flow
import { ResponseHeaders } from '../../utils/headers';
import type Logger from '../../../logger';
import type { Response } from '../../../response';

type Options = {
  logger: Logger;
  resolve: Function;
};

export function create({ logger, resolve }: Options): Response {
  const send = (data: string) => resolve(data);
  const headers = new ResponseHeaders(() => undefined);
  const response = {
    send,
    logger,
    headers,
    end: send,
    stats: [],
    status: (code: number) => {
      response.statusCode = code;
      return response;
    },
    getHeader: key => headers.get(key),
    setHeader: (key, value) => headers.set(key, value),
    removeHeader: key => headers.delete(key),
    statusCode: 200,
    statusMessage: 'OK',
  };

  return response;
}
