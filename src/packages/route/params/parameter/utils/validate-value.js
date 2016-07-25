// @flow
import { ParameterValueError } from '../../errors';

import type Parameter from '../index';

/**
 * @private
 */
function validateOne(param: Parameter, value: mixed): true {
  if (!param.has(value)) {
    throw new ParameterValueError(param, value);
  }

  return true;
}

/**
 * @private
 */
export default function validateValue(param: Parameter, value: mixed): true {
  if (param.size > 0) {
    if (Array.isArray(value)) {
      for (const item of value) {
        validateOne(param, item);
      }
    } else {
      validateOne(param, value);
    }
  }

  return true;
}
