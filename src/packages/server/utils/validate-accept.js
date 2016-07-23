// @flow
import { JSONAPI } from '../../../constants';

import { NotAcceptableError } from '../errors';

export default function validateAccept(contentType?: string): true {
  if (contentType !== JSONAPI) {
    throw new NotAcceptableError(contentType || 'undefined');
  }

  return true;
}
