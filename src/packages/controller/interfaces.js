// @flow
import type Database, { Model } from '../database';
import type Serializer from '../serializer';
import type Controller from './index';

export type Controller$opts = {
  model: Class<Model>;
  namespace: string;
  serializer: Serializer;
};

export type Controller$builtIn =
  | 'show'
  | 'index'
  | 'create'
  | 'update'
  | 'destroy';
