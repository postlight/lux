// @flow
import {
  Server as http$Server,
  IncomingMessage as http$IncomingMessage,
  ServerResponse as http$ServerResponse
} from 'http';

import { Model } from '../src/packages/database';

import type Route from '../src/packages/route';

type params = {
  data?: {
    id: number | string | Buffer;
    type: string;
    attributes?: Object;
    relationships?: Object;
  };

  page: {
    size: number;
    number: number;
  };

  fields: Object;
  filter: Object;
  id?: number | string | Buffer;
  include: Array<string> | Object;
  sort: string | [string, string];
};

declare module 'http' {
  declare class Server extends http$Server {}

  declare class IncomingMessage extends http$IncomingMessage {
    route?: Route;
    params: params;
    record?: Model;
    method: string;

    parsedURL: {
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
  }

  declare class ServerResponse extends http$ServerResponse {}

  declare function createServer(
    handler: (req: IncomingMessage, res: ServerResponse) => void
  ): Server;
}
