// @flow
import type Logger from '../../logger';

type Response$stat = {
  type: string;
  name: string;
  duration: number;
  controller: string;
};

export type Response$opts = {
  logger: Logger
};

export interface Response extends stream$Writable {
  [key: string]: void | ?mixed;

  stats: Array<Response$stat>;
  logger: Logger;
  statusCode: number;
  statusMessage: string;

  status(value: number): Response;
  getHeader(name: string): void | string;
  setHeader(name: string, value: string): void;
  removeHeader(name: string): void;
}
