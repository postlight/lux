// @flow
import type Logger from '../../logger';
import type Router from '../../router';
import type Route from '../../route';

type Request$url = {
  protocol?: string;
  slashes?: boolean;
  auth?: string;
  host?: string;
  port?: string;
  hostname?: string;
  hash?: string;
  search?: string;
  query: Object;
  pathname: string;
  path: string;
  href: string;
};

export type Request$opts = {
  logger: Logger;
  router: Router;
};

export type Request$params = {
  data: {
    id: number | string | Buffer;
    type: string;
    attributes?: Object;
    relationships?: Object;
  };

  page: {
    size: number;
    number: number;
  };

  fields: Array<string>;
  filter: Object;
  id: number | string | Buffer;
  include: Object;
  sort: [string, ('ASC' | 'DESC')];
};

declare export class Request extends stream$Readable {
  headers: Map<string, string>;
  httpVersion: string;
  method: string;
  trailers: Object;
  socket: net$Socket;
  logger: Logger;
  params: Request$params;
  defaultParams: Request$params;
  route: Route;
  url: Request$url;

  connection: {
    encrypted: boolean;
    remoteAddress: string;
  };

  setTimeout(msecs: number, callback: Function): void
}
