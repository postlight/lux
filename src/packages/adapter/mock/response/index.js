// @flow
import { ResponseHeaders } from '../../utils/headers';
import type Logger from '../../../logger';
import type { Response } from '../../../response';

type Options = {
  logger: Logger;
  resolve?: (data: any) => void;
};

export function create(options: Options): Response {
  const headers = new ResponseHeaders(() => undefined);
  const response = {
    headers,
    end: (body: string) => response.send(body),
    send: (body: string) => {
      if (options.resolve) {
        options.resolve({
          body,
          headers,
          status: response.statusCode,
          statusText: response.statusMessage,
        });
      }
    },
    stats: [],
    logger: options.logger,
    status: (code: number) => {
      response.statusCode = code;
      return response;
    },
    getHeader: key => headers.get(key),
    setHeader: (key, value) => {
      headers.set(key, value);
    },
    removeHeader: key => {
      headers.delete(key);
    },
    statusCode: 200,
    statusMessage: 'OK',
  };

  return response;
}
