// @flow
import { JSONAPI } from '../../../constants';

import createServerError from '../utils/create-server-error';
import { line } from '../../logger';

class UnsupportedMediaTypeError extends TypeError {
  constructor(contentType: string): UnsupportedMediaTypeError {
    super(line`
      Content-Type: '${contentType}' is not supported. Please use ${JSONAPI}
      instead.
    `);

    return this;
  }
}

export default createServerError(UnsupportedMediaTypeError, 415);
