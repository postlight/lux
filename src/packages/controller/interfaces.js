// @flow
import type Database, { Model } from '../database';
import type Serializer from '../serializer';
import type Controller from './index';

export type Controller$opts = {
  store: Database;
  model: Class<Model>;
  serializer: Serializer;
  controllers: Map<string, Controller>;
  parentController: ?Controller;
};
