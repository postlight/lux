// @flow
import type Database, { Model, Query } from '../database';
import type { Request, Response } from '../server';
import type Serializer from '../serializer';
import type Controller from './index';

export type Controller$opts = {
  model?: Class<Model>;
  namespace?: string;
  serializer?: Serializer<*>;
};

export type Controller$builtIn =
  | 'show'
  | 'index'
  | 'create'
  | 'update'
  | 'destroy';

export type Controller$beforeAction = (
  request: Request,
  response: Response
) => Promise<any>;

export type Controller$afterAction = (
  request: Request,
  response: Response,
  responseData: any
) => Promise<any>;

export type Controller$findOne<T: Model> = (
  request: Request
) => Query<T>;

export type Controller$findMany<T: Model> = (
  request: Request
) => Query<Array<T>>;
