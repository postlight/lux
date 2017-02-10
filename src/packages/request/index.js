// @flow
import type Logger from '../logger';

export type URL = {
  protocol?: string;
  slashes?: boolean;
  auth?: string;
  host?: string;
  port?: string;
  hostname?: string;
  hash?: string;
  search?: string;
  query?: any;
  pathname?: string;
  path?: string;
  href: string;
};

export type Params = {
  [key: string]: any;
};

export type Method =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'OPTIONS';

export type Request = {
  url: URL;
  params: Params;
  logger: Logger;
  method: Method;
  headers: Map<string, string>;
  trailers: Map<string, string>;
  encrypted: boolean;
  defaultParams: Params;
};
