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

declare export class Response extends stream$Writable {
  [key: string]: void | ?mixed;

  stats: Array<Response$stat>;
  logger: Logger;
  statusCode: number;
  statusMessage: string;

  getHeader(name: string): void | string;
  setHeader(name: string, value: string): void;
  removeHeader(name: string): void;
}
