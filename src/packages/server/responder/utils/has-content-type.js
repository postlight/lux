// @flow
import type { Response } from '../../index';

export default function hasContentType(res: Response) {
  let contentType = res.getHeader('Content-Type');

  if (!contentType) {
    contentType = res.getHeader('content-type');
  }

  return Boolean(contentType);
}
