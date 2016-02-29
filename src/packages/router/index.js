import Base from '../base';

import bound from '../../decorators/bound';

const routesKey = Symbol('routes');

class Router extends Base {
  constructor() {
    return super({
      [routesKey]: new Map()
    });
  }

  @bound
  route(name, options = {}) {
    const routes = this[routesKey];
    const controller = this.container.lookup('controller', name.replace(/^(.+)\/.+$/ig, '$1'));
    let { action, method } = options;

    if (controller) {
      method = (method || 'GET').toUpperCase();
      routes.set(`${method}:/${name}`, controller[action]);
    }
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

    if (this.enableCORS) {
      this.route(name, {
        method: 'HEAD',
        action: 'ok'
      });

      this.route(name, {
        method: 'OPTIONS',
        action: 'ok'
      });
    }
  }

  resolve(req, res) {
    const routes = this[routesKey];
    const idPattern = /(?![\=])(\d+)/ig;
    const staticPath = req.url.pathname.replace(idPattern, ':id');

    const route = routes.get(`${req.method}:${staticPath}`);

    if (route) {
      (req.url.pathname.match(idPattern) || []).find(id => {
        req.params.id = parseInt(id, 10);
      });

      this.visit(req, res, route);
    } else {
      this.notFound(req, res);
    }
  }

  async visit(req, res, route) {
    try {
      let data, handler;
      const { session } = req;
      const handlers = route();

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
        res.statusCode = 200;
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
}

export default Router;
