import http from 'http';
import { parse as parseURL } from 'url';

import Base from '../base';
import Session from '../session';

import bodyParser from './utils/body-parser';

import bound from '../../decorators/bound';

const { isArray } = Array;

class Server extends Base {
  constructor(props) {
    super(props);

    this.instance = http.createServer(this.handleRequest);

    return this;
  }

  listen(port) {
    this.instance.listen(port);
  }

  @bound
  handleRequest(req, res) {
    setImmediate(async () => {
      try {
        req.setEncoding('utf8');

        res.setHeader('Content-Type', 'application/vnd.api+json');

        req.xhr = req.headers['x-requested-with'] === 'XMLHttpRequest';

        req.url = parseURL(req.url, true);

        req.session = Session.create({
          cookie: req.headers.cookie,
          sessionKey: this.application.sessionKey,
          sessionSecret: this.application.sessionSecret
        });

        req.params = {};

        for (let key in req.url.query) {
          req.params[key.replace('[]', '')] = req.url.query[key];
        }

        for (let key in req.params) {
          let value = req.params[key];

          if (isArray(value)) {
            req.params[key] = value.map(v => {
              return /^\d+$/ig.test(value) ? parseInt(v, 10) : v;
            });
          } else {
            if (/^\d+$/ig.test(value)) {
              req.params[key] = parseInt(value, 10);
            }
          }

          if (key.includes('[]')) {
            delete req.params[key];
            req.params[key.replace('[]', '')] = value;
          }
        }

        if (/(PATCH|POST|PUT)/g.test(req.method)) {
          const body = await bodyParser(req);

          req.body = body;
          req.params = {
            ...body,
            ...req.params
          };
        }

        this.router.resolve(req, res);
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export default Server;
