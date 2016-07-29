// @flow
import { MIME_TYPE } from '../../jsonapi';

import normalize from './utils/normalize';
import hasContentType from './utils/has-content-type';

import type { Request, Response } from '../index';

/**
 * @private
 */
export function createResponder(req: Request, res: Response) {
  return function respond(data?: ?mixed) {
    const normalized = normalize(data);

    if (normalized.statusCode) {
      res.statusCode = normalized.statusCode;
    }

    if (res.statusCode !== 204 && !hasContentType(res)) {
      res.setHeader('Content-Type', MIME_TYPE);
    }

    res.end(normalized.data);
  };
}
