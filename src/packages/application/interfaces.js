// @flow
import type { Config } from '../config';
import type Database, { Database$config } from '../database';
import type Controller from '../controller';
import type Serializer from '../serializer';

export type Application$opts = Config & {
  path: string;
  port: number;
  database: Database$config;
};

export type Application$factoryOpts<T: Controller | Serializer<*>> = {
  key: string;
  store: Database;
  parent: ?T;
};
