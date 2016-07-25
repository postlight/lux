// @flow
import { createServerError } from '../../../server';

/**
 * @private
 */
class InvalidParameterError extends TypeError {
  constructor(path: string): InvalidParameterError {
    super(`'${path}' is not a valid parameter for this resource.`);
    return this;
  }
}

export default createServerError(InvalidParameterError, 400);
