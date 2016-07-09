// @flow
import http from 'http';
import { parse as parseURL } from 'url';

import chalk, { cyan } from 'chalk';

import responder from './responder';
import { line } from '../logger';

import entries from '../../utils/entries';
import tryCatch from '../../utils/try-catch';
import formatParams from './utils/format-params';

import type {
  Server as HTTPServer,
  IncomingMessage,
  ServerResponse
} from 'http';

import type Logger from '../logger';
import type Router from '../router';

/**
 * @private
 */
class Server {
  router: Router;

  logger: Logger;

  instance: HTTPServer;

  constructor({
    logger,
    router
  }: {
    logger: Logger,
    router: Router
  } = {}): Server {
    const instance = http.createServer((req, res) => {
      this.receiveRequest(req, res);
    });

    Object.defineProperties(this, {
      router: {
        value: router,
        writable: false,
        enumerable: false,
        configurable: false
      },

      logger: {
        value: logger,
        writable: false,
        enumerable: false,
        configurable: false
      },

      instance: {
        value: instance,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }

  listen(port: number): void {
    this.instance.listen(port);
  }

  receiveRequest(req: IncomingMessage, res: ServerResponse): void {
    tryCatch(async () => {
      req.setEncoding('utf8');
      res.setHeader('Content-Type', 'application/vnd.api+json');

      req.url = parseURL(req.url, true);

      Object.assign(req, {
        route: this.router.match(req),
        params: await formatParams(req),
        headers: new Map(entries(req.headers)),
      });

      if (req.headers.has('X-HTTP-Method-Override')) {
        req.method = req.headers.get('X-HTTP-Method-Override');
      }

      this.logRequest(req, res);

      if (req.route) {
        req.params = {
          ...req.params,
          ...req.route.parseParams(req.url.pathname)
        };
      }

      this.sendResponse(req, res, await this.router.visit(req, res));
    }, err => {
      this.sendResponse(req, res, err);
    });
  }

  sendResponse(
    req: IncomingMessage,
    res: ServerResponse,
    data: void | ?mixed
  ): void {
    if (data && typeof data.pipe === 'function') {
      data.pipe(res);
    } else {
      responder.resolve(req, res, data);
    }
  }

  logRequest(req: IncomingMessage, res: ServerResponse): void {
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

      const colorString = Reflect.get(chalk, statusColor);

      this.logger.info(line`
        ${cyan(`${method}`)} ${url.pathname} -> Finished after
        ${new Date().getTime() - startTime.getTime()} ms with
        ${Reflect.apply(colorString, null, [`${statusCode}`])}
        ${Reflect.apply(colorString, null, [`${statusMessage}`])}
      `);
    });
  }
}

export default Server;
