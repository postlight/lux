// @flow
import { ID_PATTERN } from '../route';

import define from './define';

import type { IncomingMessage, ServerResponse } from 'http';

import type Controller from '../controller';
import type Route from '../route';
import type { options } from '../route/interfaces';

/**
 * @private
 */
class Router extends Map<string, Route> {
  initialized: boolean;

  constructor({
    routes,
    controllers
  }: {
    routes: () => void,
    controllers: Map<string, Controller>
  }): Router {
    super();

    Reflect.apply(routes, {
      route: (path: string, opts: options) => define.route({
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

    return this;
  }

  set(key: string, value: Route): Router {
    if (!this.initialized) {
      super.set(key, value);
    }

    return this;
  }

  match({ method, url: { pathname } }: IncomingMessage): void | Route {
    const staticPath = pathname.replace(ID_PATTERN, ':dynamic');

    return this.get(`${method}:${staticPath}`);
  }

  async visit(req: IncomingMessage, res: ServerResponse): void | ?mixed {
    if (req.route) {
      let i, data, handler;
      const { route: { handlers } } = req;

      for (i = 0; i < handlers.length; i++) {
        handler = handlers[i];
        data = await handler(req, res);

        if (typeof data !== 'undefined') {
          return data;
        }
      }

      return data;
    }
  }
}

export default Router;
