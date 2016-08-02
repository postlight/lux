// @flow
import type Router from '../index';
import type Controller from '../../controller';
import type { Route$opts } from '../../route';

export type Router$route = Route$opts & {
  router: Router;
};

export type Router$resource = {
  path: string;
  router: Router;
  controllers: Map<string, Controller>;
};
