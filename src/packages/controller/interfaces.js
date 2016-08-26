// @flow
import type Database, { Model } from '../database';
import type Serializer from '../serializer';
import type Controller from './index';

export type Controller$opts = {
  store: Database;
  model: Class<Model>;
  parent: ?Controller;
  namespace: string;
  serializer: Serializer;
  controllers: Map<string, Controller>;
};

export type Controller$builtIn =
  | 'show'
  | 'index'
  | 'create'
  | 'update'
  | 'destroy';
