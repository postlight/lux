import Base from '../base';
import Route from '../route';

import bound from '../../decorators/bound';

const routesKey = Symbol('routes');

class Router extends Base {
  constructor() {
    return super({
      [routesKey]: new Map()
    });
  }

  @bound
  route(path, options = {}) {
    const { method, action } = options;
    const routes = this[routesKey];
    const route = Route.create({
      path,
      method,
      action,
      container: this.container
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
      method: 'PUT',
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

  resolve(req, res) {
    const routes = this[routesKey];
    const idPattern = /(?![\=])(\d+)/g;
    const staticPath = req.url.pathname.replace(idPattern, ':dynamic');

    const route = routes.get(`${req.method}:${staticPath}`);

    if (route && route.handlers) {
      const ids = (req.url.pathname.match(idPattern) || []);

      for (let i = 0; i < ids.length; i++) {
        let key = route.dynamicSegments[i];

        if (key) {
          req.params[key] = parseInt(ids[i], 10);
        }
      }

      this.visit(req, res, route);
    } else {
      this.notFound(req, res);
    }
  }

  async visit(req, res, route) {
    try {
      let data, handler;
      const { method, session } = req;
      const handlers = route.handlers();

      for (handler of handlers()) {
        data = await handler(req, res);

        if (data === false) {
          return this.unauthorized(req, res);
        }
      }

      if (session.didChange) {
        const cookie = `${session.sessionKey}=${session.cookie}; path=/`;

        res.setHeader('Set-Cookie', cookie);
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
    } catch (err) {
      this.error(err, req, res);
    }
  }

  error(err, req, res) {
    const serializer = this.container.lookup('serializer', 'application');

    res.statusCode = 500;
    serializer.serialize({
      errors: [{
        title: 'Internal Server Error',
        status: 500,
        detail: err.message
      }]
    }).pipe(res);
  }

  unauthorized(req, res) {
    const serializer = this.container.lookup('serializer', 'application');

    res.statusCode = 401;
    serializer.serialize({
      errors: [{
        title: 'Unauthorized',
        status: 401
      }]
    }).pipe(res);
  }

  notFound(req, res) {
    const serializer = this.container.lookup('serializer', 'application');

    res.statusCode = 404;
    serializer.serialize({
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
}

export default Router;
