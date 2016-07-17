// @flow
import { createServer, IncomingMessage, Server as HTTPServer } from 'http';

import { createRequest, formatParams } from './request';
import { createResponse } from './response';
import { createResponder } from './responder';

import tryCatch from '../../utils/try-catch';

import type { Writable } from 'stream';

import type { Server$opts } from './interfaces';

/**
 * @private
 */
class Server {
  logger: Server$opts.logger;

  router: Server$opts.router;

  instance: HTTPServer;

  constructor({ logger, router }: Server$opts): Server {
    const instance = createServer((req: IncomingMessage, res: Writable) => {
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

  receiveRequest(req: IncomingMessage, res: Writable): void {
    const startTime = Date.now();
    const { logger, router } = this;

    const request = createRequest(req, {
      logger,
      router
    });

    const response = createResponse(res, {
      logger
    });

    request.setEncoding('utf8');
    response.setHeader('Content-Type', 'application/vnd.api+json');

    logger.request(request, response, {
      startTime
    });

    const respond = createResponder(request, response);

    if (request.route) {
      tryCatch(async () => {
        Object.assign(request, {
          params: {
            ...request.params,
            ...(await formatParams(req))
          }
        });

        respond(await router.visit(request, response));
      }, respond);
    } else {
      respond(404);
    }
  }
}

export default Server;

export type { Request, Request$params } from './request/interfaces';
export type { Response } from './response/interfaces';
