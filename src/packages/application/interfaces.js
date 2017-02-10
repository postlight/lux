// @flow
import type { Config } from '../config';
import type Database, { Config as DatabaseConfig } from '../database';
import type Controller from '../controller';
import type Serializer from '../serializer';

export type Application$opts = Config & {
  path: string;
  port: string | number;
  database: DatabaseConfig;
};

export type Application$factoryOpts<T: Controller | Serializer<*>> = {
  key: string;
  store: Database;
  parent: ?T;
};
