// @flow
import type { Logger$config } from '../logger';
import type { Server$config } from '../server';

export type Config = {
  logging: Logger$config;
  server: Server$config;
};
