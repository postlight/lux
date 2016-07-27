// @flow
import type Logger from '../logger';
import type Router from '../router';

export type Server$opts = {
  logger: Logger;
  router: Router;
};

export interface Server$Error extends Error {
  statusCode: number;
}
