/* @flow */

import type Logger from '../logger';
import type { Model } from './index';

type Database$pool = number | {
  min: number;
  max: number;
};

type Database$columnType =
  | 'floating'
  | 'enu'
  | 'bool'
  | 'varchar'
  | 'bigInteger';

export type Database$environment = {
  host?: string;
  pool?: Database$pool;
  debug?: boolean;
  driver: string;
  socket?: string;
  memory?: boolean;
  database?: string;
  username?: string;
  password?: string;
  port?: number;
  ssl?: boolean;
  url?: string;
};

export type Config = {
  development: Database$environment;
  test: Database$environment;
  production: Database$environment;
};

export type Database$opts = {
  path: string;
  models: Map<string, Class<Model>>;
  config: Config;
  logger: Logger;
  checkMigrations: boolean;
};

export type Database$column = {
  type: Database$columnType;
  nullable: boolean;
  maxLength: string;
  columnName: string;
  defaultValue: ?mixed;
};
