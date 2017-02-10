// @flow
import createServerError from '../../../../../errors/utils/create-server-error';

/**
 * @private
 */
class ParameterRequiredError extends TypeError {
  constructor(path: string) {
    super(`Missing required parameter '${path}'.`);
  }
}

export default createServerError(ParameterRequiredError, 400);
