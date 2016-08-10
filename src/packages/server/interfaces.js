// @flow
import type Logger from '../logger';
import type Router from '../router';

export type Server$cors = {
  enabled: boolean;
  origin?: string;
  headers?: Array<string>;
  methods?: Array<string>;
};

export type Server$config = {
  cors: Server$cors;
};

export type Server$opts = Server$config & {
  logger: Logger;
  router: Router;
};

export interface Server$Error extends Error {
  statusCode: number;
}
