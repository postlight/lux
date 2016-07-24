// @flow
import { hasMediaType, NotAcceptableError } from '../../jsonapi';

/**
 * @private
 */
export default function validateAccept(contentType?: string): true {
  if (contentType && hasMediaType(contentType)) {
    throw new NotAcceptableError(contentType);
  }

  return true;
}
