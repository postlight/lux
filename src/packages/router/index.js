// @flow
import { ID_PATTERN } from '../route';

import { FreezeableMap } from '../freezeable';

import define from './define';

import type { Request } from '../server';
import type { Router$opts } from './interfaces';
import type Route, { Route$opts } from '../route';

/**
 * @private
 */
class Router extends FreezeableMap<string, Route> {
  constructor({ routes, controllers }: Router$opts) {
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

    this.freeze();
  }

  match({ method, url: { pathname } }: Request) {
    const staticPath = pathname.replace(ID_PATTERN, ':dynamic');

    return this.get(`${method}:${staticPath}`);
  }
}

export default Router;
