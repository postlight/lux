// @flow
import type { Logger$config } from '../logger';
import type { Server$opts } from '../server';

export type Config = {
  logging: Logger$config;
  server: Server$opts.server;
};
