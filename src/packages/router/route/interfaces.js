// @flow
import type Controller from '../../controller';
import type { Request, Response, Request$method } from '../../server';

export type Route$type =
  | 'custom'
  | 'member'
  | 'collection';

export type Route$opts = {
  type: Route$type;
  path: string;
  action: string;
  method: Request$method;
  controller: Controller<*>;
};
