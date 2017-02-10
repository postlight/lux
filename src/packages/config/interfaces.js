// @flow
import type { AdapterFactory } from '../adapter';
import type { Logger$config } from '../logger';

export type Config = {
  logging: Logger$config;
  server: any;
  adapter: AdapterFactory;
};
