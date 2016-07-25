// @flow
import { ParameterTypeError } from '../errors';

import isBuffer from '../../../../utils/is-buffer';
import isObject from '../../../../utils/is-object';

import type { Parameter, ParameterGroup } from '../index';

/**
 * @private
 */
export default function validateType(
  param: Parameter | ParameterGroup,
  value: mixed
): true {
  const { type } = param;

  if (type) {
    const valueType = typeof value;
    let isValid;

    switch (type) {
      case 'array':
        isValid = Array.isArray(value);
        break;

      case 'buffer':
        isValid = isBuffer(value);
        break;

      case 'object':
        isValid = isObject(value);
        break;

      default:
        isValid = type === valueType;
    }

    if (!isValid) {
      throw new ParameterTypeError(param, valueType);
    }
  }

  return true;
}
