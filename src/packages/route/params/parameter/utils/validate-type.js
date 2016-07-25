// @flow
import { ParameterTypeError } from '../errors';

import type Parameter from '../index';

/**
 * @private
 */
export default function validateType(param: Parameter, value: mixed): true {
  const { type } = param;

  if (type) {
    const typeOfValue = typeof value;

    switch (type) {
      case 'array':
        if (!Array.isArray(value)) {
          throw new ParameterTypeError(param, typeOfValue);
        }
        break;

      default:
        if (typeOfValue !== type) {
          throw new ParameterTypeError(param, typeOfValue);
        }
    }
  }

  return true;
}
