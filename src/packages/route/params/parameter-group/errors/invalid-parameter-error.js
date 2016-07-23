// @flow
import { createServerError } from '../../../../server';

class InvalidParameterError extends TypeError {
  constructor(path: string): InvalidParameterError {
    super(`Parameter '${path}' is not a valid parameter for this resource.`);
    return this;
  }
}

export default createServerError(InvalidParameterError, 400);
