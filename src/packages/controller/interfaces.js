// @flow
import type Database, { Model } from '../database';
import type { Request, Response } from '../server';
import type Serializer from '../serializer';
import type Controller from './index';

export type Controller$opts = {
  model: Class<Model>;
  namespace: string;
  serializer: Serializer<*>;
};

export type Controller$builtIn =
  | 'show'
  | 'index'
  | 'create'
  | 'update'
  | 'destroy';

export type Controller$Middleware = (
  request: Request,
  response: Response
) => Promise<any>;
