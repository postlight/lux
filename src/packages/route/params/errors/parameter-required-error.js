// @flow
import { createServerError } from '../../../server';

/**
 * @private
 */
class ParameterRequiredError extends TypeError {
  constructor(path: string) {
    super(`Missing required parameter '${path}'.`);
  }
}

export default createServerError(ParameterRequiredError, 400);
