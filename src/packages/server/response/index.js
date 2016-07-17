// @flow
import type { Response, Response$opts } from './interfaces';

export function createResponse(res: any, opts: Response$opts): Response {
  return Object.assign(res, opts, {
    stats: []
  });
}
