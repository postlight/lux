// @flow
import { MIME_TYPE } from '../constants';
import { line } from '../../logger';
import { createServerError } from '../../server';

/**
 * @private
 */
class UnsupportedMediaTypeError extends TypeError {
  constructor(contentType: string) {
    super(line`
      Media type parameters is not supported. Try your request again
      without specifying '${contentType.replace(MIME_TYPE, '')}'.
    `);
  }
}

export default createServerError(UnsupportedMediaTypeError, 415);
