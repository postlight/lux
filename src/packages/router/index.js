// @flow
import { ID_PATTERN } from '../route';

import { FreezeableMap } from '../freezeable';

import define from './define';

import type { Router$opts } from './interfaces';
import type Route, { Route$opts } from '../route';
import type { Request } from '../server';

/**
 * @private
 */
class Router extends FreezeableMap<string, Route> {
  initialized: boolean;

  constructor({ routes, controllers }: Router$opts): Router {
    super();

    Reflect.apply(routes, {
      route: (path: string, opts: Route$opts) => define.route({
        ...opts,
        path,
        controllers,
        router: this
      }),

      resource: (path: string) => define.resource({
        path,
        controllers,
        router: this
      })
    }, []);

    Reflect.defineProperty(this, 'initialized', {
      value: true,
      writable: false,
      enumerable: false,
      configurable: false
    });

    return this.freeze();
  }

  match({ method, url: { pathname } }: Request): void | Route {
    const staticPath = pathname.replace(ID_PATTERN, ':dynamic');

    return this.get(`${method}:${staticPath}`);
  }
}

export default Router;
