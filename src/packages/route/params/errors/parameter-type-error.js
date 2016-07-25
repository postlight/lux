// @flow
import { line } from '../../../logger';
import { createServerError } from '../../../server';

import type { Parameter, ParameterGroup } from '../index';

/**
 * @private
 */
class ParameterTypeError extends TypeError {
  constructor(
    param: Parameter | ParameterGroup,
    actual: string
  ): ParameterTypeError {
    const { type, path } = param;

    super(line`
      Expected type '${type ? type : ''}' for parameter '${path}' but got
      '${actual}'.
    `);

    return this;
  }
}

export default createServerError(ParameterTypeError, 400);
