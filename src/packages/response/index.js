/* @flow */

import type Logger from '../logger'

/* eslint-disable no-use-before-define */

export type Options = {
  stats: Array<Object>;
  logger: Logger;
  headers: Map<string, string>;
  statusCode: number;
  statusMessage: string;
  end(data: string): void;
  send(data: string): void;
  status(code: number): Response;
  getHeader(key: string): void | string;
  setHeader(key: string, value: string): void;
  removeHeader(key: string): void;
};

/* eslint-enable no-use-before-define */

/**
 * @class Response
 * @public
 */
class Response {
  stats: Array<Object>;
  logger: Logger;
  headers: Map<string, string>;
  statusCode: number;
  statusMessage: string;
  end: (data: string) => void;
  send: (data: string) => void;
  status: (code: number) => Response;
  getHeader: (key: string) => void | string;
  setHeader: (key: string, value: string) => void;
  removeHeader: (key: string) => void;

  constructor(options: Options) {
    Object.assign(this, options)
  }
}

export default Response
export * from './constants'
