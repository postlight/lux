// @flow
import { createServerError } from '../../../../server';
import type { ParameterLike } from '../index';

/**
 * @private
 */
class ParameterNotNullableError extends TypeError {
  constructor({ path }: ParameterLike) {
    super(`Parameter '${path}' is not nullable.`);
  }
}

export default createServerError(ParameterNotNullableError, 400);
