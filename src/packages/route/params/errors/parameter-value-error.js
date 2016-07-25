// @flow
import { line } from '../../../logger';
import { createServerError } from '../../../server';

import type { Parameter } from '../index';

/**
 * @private
 */
class ParameterValueError extends TypeError {
  constructor(param: Parameter, actual: mixed): ParameterValueError {
    super(line`
      Expected value for parameter '${param.path}' to be one of
      [${param.size ? Array.from(param).join(', ') : ''}] but got ${actual}.
    `);

    return this;
  }
}

export default createServerError(ParameterValueError, 400);
