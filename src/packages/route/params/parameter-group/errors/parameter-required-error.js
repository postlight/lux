// @flow
import { createServerError } from '../../../../server';

class ParameterRequiredError extends TypeError {
  constructor(path: string): ParameterRequiredError {
    super(`Missing required parameter '${path}'.`);
    return this;
  }
}

export default createServerError(ParameterRequiredError, 400);
