// @flow
import { line } from '../../../../logger';
import { createServerError } from '../../../../server';

import type Parameter from '../index';

/**
 * @private
 */
class ParameterTypeError extends TypeError {
  constructor({ type, path }: Parameter, actual: string): ParameterTypeError {
    super(line`
      Expected a '${type ? type : ''}' for parameter '${path}' but got
      '${actual}'.
    `);

    return this;
  }
}

export default createServerError(ParameterTypeError, 400);
