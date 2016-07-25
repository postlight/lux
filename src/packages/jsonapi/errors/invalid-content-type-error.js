// @flow
import { MIME_TYPE } from '../constants';

import { line } from '../../logger';
import { createServerError } from '../../server';

/**
 * @private
 */
class InvalidContentTypeError extends TypeError {
  constructor(contentType?: string = 'undefined'): InvalidContentTypeError {
    super(line`
      Content-Type: '${contentType}' is not supported. Try your request again
      with Content-Type: '${MIME_TYPE}'.
    `);

    return this;
  }
}

export default createServerError(InvalidContentTypeError, 400);
