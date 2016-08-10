// @flow
import type Logger from '../logger';
import type Router from '../router';

export type Server$cors = {
  origin?: string;
  enabled?: boolean;
  headers?: Array<string>;
  methods?: Array<string>;
}

export type Server$opts = {
  logger: Logger;
  router: Router;
  server: {
    cors: Server$cors;
  }
};

export interface Server$Error extends Error {
  statusCode: number;
}
