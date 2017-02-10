// @flow
import { MIME_TYPE } from '../jsonapi';
import type { Request } from '../request';
import type { Response } from '../response';

import normalize from './utils/normalize';

type Responder = (content: any) => void;

/**
 * @private
 */
export function create(request: Request, response: Response): Responder {
  return content => {
    const { headers } = response;
    const { data, statusCode } = normalize(content);

    if (statusCode) {
      response.status(statusCode);
    }

    if (statusCode !== 204 && !headers.has('content-type')) {
      headers.set('content-type', MIME_TYPE);
    }

    response.send(data);
  };
}
