// @flow
import { createServer } from 'http';

import { HAS_BODY } from './constants';

import { createRequest, parseRequest } from './request';
import { createResponse } from './response';
import { createResponder } from './responder';

import { tryCatchSync } from '../../utils/try-catch';
import validateAccept from './utils/validate-accept';
import validateContentType from './utils/validate-content-type';
import setCORSHeaders from './utils/set-cors-headers';

import type { Writable } from 'stream';
import type { IncomingMessage, Server as HTTPServer } from 'http';

import type Logger from '../logger';
import type Router from '../router';
import type { Request } from './request/interfaces';
import type { Response } from './response/interfaces';
import type { Server$opts, Server$cors } from './interfaces';

/**
 * @private
 */
class Server {
  logger: Logger;

  router: Router;

  cors: Server$cors;

  instance: HTTPServer;

  constructor({ logger, router, cors }: Server$opts) {
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

      cors: {
        value: cors,
        writable: false,
        enumerable: false,
        configurable: false
      },

      instance: {
        value: createServer(this.receiveRequest),
        writable: false,
        enumerable: false,
        configurable: false
      }
    });
  }

  listen(port: number): void {
    this.instance.listen(port);
  }

  initializeRequest(req: IncomingMessage, res: Writable): [Request, Response] {
    const { logger, router, cors } = this;

    req.setEncoding('utf8');

    const response = createResponse(res, {
      logger
    });

    setCORSHeaders(response, cors);

    const request = createRequest(req, {
      logger,
      router
    });

    return [request, response];
  }

  validateRequest({ method, headers }: Request): true {
    let isValid = validateAccept(headers.get('accept'));

    if (HAS_BODY.test(method)) {
      isValid = validateContentType(headers.get('content-type'));
    }

    return isValid;
  }

  receiveRequest = (req: IncomingMessage, res: Writable): void => {
    const { logger } = this;
    const [request, response] = this.initializeRequest(req, res);
    const respond = createResponder(request, response);

    logger.request(request, response, {
      startTime: Date.now()
    });

    const isValid = tryCatchSync(() => {
      return this.validateRequest(request);
    }, respond);

    if (isValid) {
      parseRequest(request)
        .then(params => {
          const { route } = request;

          Object.assign(request, {
            params
          });

          if (route) {
            return route.visit(request, response);
          }
        })
        .then(respond)
        .catch(err => {
          logger.error(err);
          respond(err);
        });
    }
  }
}

export default Server;
export { getDomain } from './request';
export { default as createServerError } from './utils/create-server-error';

export type { Server$config } from './interfaces';

export type {
  Request,
  Request$params,
  Request$method
} from './request/interfaces';

export type { Response } from './response/interfaces';
