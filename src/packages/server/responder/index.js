// @flow
import { MIME_TYPE } from '../../jsonapi';
import type { Request, Response } from '../index';

import normalize from './utils/normalize';
import hasContentType from './utils/has-content-type';

/**
 * @private
 */
export function createResponder(req: Request, res: Response) {
  return function respond(input: any) {
    const { data, statusCode } = normalize(input);

    if (statusCode) {
      res.status(statusCode);
    }

    if (statusCode !== 204 && !hasContentType(res)) {
      res.setHeader('Content-Type', MIME_TYPE);
    }

    res.end(data);
  };
}
