// @flow
import { createServerError } from '../../../../server';

/**
 * @private
 */
class InvalidParameterError extends TypeError {
  constructor(path: string) {
    super(`'${path}' is not a valid parameter for this resource.`);
  }
}

export default createServerError(InvalidParameterError, 400);
