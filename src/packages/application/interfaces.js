// @flow
import type { Logger$config } from '../logger';
import type { Database$config } from '../database';

export type Application$opts = {
  path: string;
  port: number;
  logging: Logger$config;
  database: Database$config;
};
