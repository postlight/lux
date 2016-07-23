// @flow
import { JSONAPI } from '../../../../constants';

import type { Request } from '../interfaces';

export default function isJSONAPI({ headers }: Request): boolean {
  const contentType = headers.get('content-type');

  return Boolean(contentType) && contentType === JSONAPI;
}
