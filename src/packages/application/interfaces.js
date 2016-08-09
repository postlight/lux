// @flow
import type { Config } from '../config';
import type { Database$config } from '../database';

export type Application$opts = Config & {
  path: string;
  port: number;
  database: Database$config;
};
