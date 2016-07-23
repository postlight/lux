// @flow
import { JSONAPI } from '../../../constants';

import { UnsupportedMediaTypeError } from '../errors';

export default function validateContentType(contentType?: string): true {
  if (contentType !== JSONAPI) {
    throw new UnsupportedMediaTypeError(contentType || 'undefined');
  }

  return true;
}
