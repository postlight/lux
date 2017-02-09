// @flow
import { createServer } from 'http';
import type { Writable } from 'stream';
import type { IncomingMessage, Server as HTTPServer } from 'http'; // eslint-disable-line max-len, no-duplicate-imports

import { freezeProps } from '../freezeable';
import { tryCatchSync } from '../../utils/try-catch';
import type Logger from '../logger';
import type Router from '../router';

import { HAS_BODY } from './constants';
import { createRequest, parseRequest } from './request';
import { createResponse } from './response';
import { createResponder } from './responder';
import validateAccept from './utils/validate-accept';
import validateContentType from './utils/validate-content-type';
import setCORSHeaders from './utils/set-cors-headers';
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

  constructor({ logger, router, cors }: Server$opts): this {
    Object.assign(this, {
      cors,
      router,
      logger,
      instance: createServer(this.receiveRequest)
    });

    freezeProps(this, false,
      'cors',
      'router',
      'logger',
      'instance'
    );

    return this;
  }

  listen(port: number): void {
    this.instance.listen(port);
  }

  initializeRequest(req: IncomingMessage, res: Writable): [Request, Response] {
    const response = createResponse(res, {
      logger: this.logger
    });

    setCORSHeaders(response, this.cors);

    const request = createRequest(req, {
      logger: this.logger,
      router: this.router
    });

    return [
      request,
      response
    ];
  }

  validateRequest({ method, headers }: Request): true {
    let isValid = validateAccept(headers.get('accept'));

    if (HAS_BODY.test(method)) {
      isValid = validateContentType(headers.get('content-type'));
    }

    return isValid;
  }

  receiveRequest = (req: IncomingMessage, res: Writable): void => {
    const [request, response] = this.initializeRequest(req, res);
    const respond = createResponder(request, response);

    this.logger.request(request, response, {
      startTime: Date.now()
    });

    const isValid = tryCatchSync(() => this.validateRequest(request), respond);

    if (isValid) {
      parseRequest(request)
        .then(params => {
          Object.assign(request, {
            params
          });

          if (request.route) {
            return request.route.visit(request, response);
          }

          return undefined;
        })
        .then(respond)
        .catch(err => {
          this.logger.error(err);
          respond(err);
        });
    }
  }
}

export default Server;
export { REQUEST_METHODS, getDomain } from './request';
export { default as createServerError } from './utils/create-server-error';

export type { Server$config } from './interfaces';

export type {
  Request,
  Request$params,
  Request$method
} from './request/interfaces';

export type { Response } from './response/interfaces';
