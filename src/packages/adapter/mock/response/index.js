// @flow
import { ResponseHeaders } from '../../utils/headers';
import type Logger from '../../../logger';
import type { Response } from '../../../response';

type Options = {
  logger: Logger;
  resolve: Function;
};

export function create(options: Options): Response {
  const headers = new ResponseHeaders(() => undefined);
  const response = {
    headers,
    end: (body: string) => response.send(body),
    send: (body: string) => {
      const { statusCode } = response;
      const ok = (): boolean => statusCode >= 200 && statusCode <= 299;
      const text = (): Promise<string> => Promise.resolve(body);
      const json = (): Promise<Object> => (
        new Promise(resolve => {
          resolve(JSON.parse(body));
        })
      );

      options.resolve({
        ok,
        text,
        json,
        headers,
        status: statusCode,
        statusText: response.statusMessage,
      });
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
