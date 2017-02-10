// @flow
import type Logger from '../logger';

export type Response = {
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
