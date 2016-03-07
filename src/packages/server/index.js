import http from 'http';
import { parse as parseURL } from 'url';

import colors from 'colors/safe';

import Base from '../base';
import Session from '../session';
import { line } from '../logger';

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
    this.logger.log(`Server listening on port ${colors.cyan(`${port}`)}`);
  }

  logRequest(req, res) {
    const startTime = new Date();

    res.once('finish', () => {
      const { url, method } = req;
      const { statusCode, statusMessage } = res;
      let statusColor;

      if (statusCode >= 200 && statusCode < 400) {
        statusColor = 'green';
      } else {
        statusColor = 'red';
      }

      this.logger.log(line`
        ${colors.cyan(`${method}`)} ${url.pathname} -> Finished after
        ${new Date().getTime() - startTime.getTime()} ms with
        ${colors[statusColor].call(null, `${statusCode}`)}
        ${colors[statusColor].call(null, `${statusMessage}`)}
      `);
    });
  }

  @bound
  async handleRequest(req, res) {
    if (this.environment !== 'production') {
      this.logRequest(req, res);
    }

    try {
      req.setEncoding('utf8');

      res.setHeader('Content-Type', 'application/vnd.api+json');

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
  }
}

export default Server;
