// @flow
import { line } from '../../../../logger';
import { createServerError } from '../../../../server';
import type { ParameterLike } from '../index';

/**
 * @private
 */
class ParameterValueError extends TypeError {
  constructor(param: ParameterLike, actual: mixed) {
    super(line`
      Expected value for parameter '${param.path}' to be one of
      [${param.size ? Array.from(param.values()).join(', ') : ''}] but got
      ${actual}.
    `);
  }
}

export default createServerError(ParameterValueError, 400);
