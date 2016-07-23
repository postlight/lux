// @flow
import { line } from '../../../../logger';
import { createServerError } from '../../../../server';

import type Parameter from '../index';

class ParameterValueError extends TypeError {
  constructor(
    { values, path }: Parameter,
    actual: mixed
  ): ParameterValueError {
    super(line`
      Expected value for parameter '${path}' to be one of
      [${values ? Array.from(values).join(', ') : ''}] but got ${actual}.
    `);

    return this;
  }
}

export default createServerError(ParameterValueError, 400);
