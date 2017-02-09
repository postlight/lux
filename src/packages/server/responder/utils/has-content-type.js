// @flow
import type { Response } from '../../index';

export default function hasContentType(res: Response): boolean {
  return Boolean(res.getHeader('content-type'));
}
