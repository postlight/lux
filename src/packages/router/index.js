import Base from '../base';
import Route from '../route';
import Serializer from '../serializer';

import tryCatch from '../../utils/try-catch';

import bound from '../../decorators/bound';

const routesKey = Symbol('routes');

class Router extends Base {
  serializer = new Serializer();
  controllers = new Map();

  constructor() {
    return super({
      [routesKey]: new Map()
    });
  }

  @bound
  route(path, options = {}) {
    const { method, action } = options;
    const routes = this[routesKey];
    const route = new Route({
      path,
      method,
      action,
      controllers: this.controllers
    });

    routes.set(`${route.method}:/${route.staticPath}`, route);
  }

  @bound
  resource(name, options = {}) {
    this.route(name, {
      method: 'GET',
      action: 'index'
    });

    this.route(`${name}/:id`, {
      method: 'GET',
      action: 'show'
    });

    this.route(name, {
      method: 'POST',
      action: 'create'
    });

    this.route(`${name}/:id`, {
      method: 'PATCH',
      action: 'update'
    });

    this.route(`${name}/:id`, {
      method: 'DELETE',
      action: 'destroy'
    });

    this.route(name, {
      method: 'HEAD',
      action: 'preflight'
    });

    this.route(name, {
      method: 'OPTIONS',
      action: 'preflight'
    });

    this.route(`${name}/:id`, {
      method: 'HEAD',
      action: 'preflight'
    });

    this.route(`${name}/:id`, {
      method: 'OPTIONS',
      action: 'preflight'
    });
  }

  visit(req, res, route) {
    tryCatch(async () => {
      let i, data, handler;
      const { handlers } = route;
      const { method, session } = req;

      for (i = 0; i < handlers.length; i++) {
        handler = handlers[i];
        data = await handler(req, res);

        if (data === false) {
          return this.unauthorized(req, res);
        }
      }

      if (session.didChange) {
        res.setHeader(
          'Set-Cookie',
          `${session.sessionKey}=${session.cookie}; path=/`
        );
      }

      if (data) {
        switch (method) {
          case 'POST':
            res.statusCode = 201;
            break;

          case 'DELETE':
            return this.noContent(req, res);

          default:
            if (data === true) {
              return this.noContent(req, res);
            } else {
              res.statusCode = 200;
            }
        }

        data.pipe(res);
      } else {
        this.notFound(req, res);
      }
    }, err => {
      this.error(err, req, res);
    });
  }

  error(err, req, res) {
    const { message } = err;

    if (message.indexOf('Validation failed') === 0) {
      res.statusCode = 403;
      this.serializer.stream({
        errors: [{
          title: 'Forbidden',
          status: 403,
          detail: message
        }]
      }).pipe(res);
    } else {
      res.statusCode = 500;
      this.serializer.stream({
        errors: [{
          title: 'Internal Server Error',
          status: 500,
          detail: message
        }]
      }).pipe(res);
    }
  }

  unauthorized(req, res) {
    res.statusCode = 401;
    this.serializer.stream({
      errors: [{
        title: 'Unauthorized',
        status: 401
      }]
    }).pipe(res);
  }

  notFound(req, res) {
    res.statusCode = 404;
    this.serializer.stream({
      errors: [{
        title: 'Not Found',
        status: 404
      }]
    }).pipe(res);
  }

  noContent(req, res) {
    res.statusCode = 204;
    res.removeHeader('Content-Type');
    res.end();
  }

  *createResolver() {
    const routes = this[routesKey];
    const idPattern = /(?![\=])(\d+)/g;

    for (;;) {
      yield (req, res) => {
        const { pathname } = req.url;
        const staticPath = pathname.replace(idPattern, ':dynamic');

        const route = routes.get(`${req.method}:${staticPath}`);

        if (route && route.handlers) {
          const { dynamicSegments } = route;
          const ids = (pathname.match(idPattern) || []);

          for (let i = 0; i < ids.length; i++) {
            let key = dynamicSegments[i];

            if (key) {
              req.params[key] = parseInt(ids[i], 10);
            }
          }

          this.visit(req, res, route);
        } else {
          this.notFound(req, res);
        }
      };
    }
  }
}

export default Router;
