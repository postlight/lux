// @flow
import ParameterTypeError from '../errors/parameter-type-error';
import ParameterNotNullableError from '../errors/parameter-not-nullable-error';
import isNull from '../../../../../utils/is-null';
import isObject from '../../../../../utils/is-object';
import isBuffer from '../../../../../utils/is-buffer';
import type { Parameter, ParameterGroup } from '../index';

/**
 * @private
 */
export default function validateType(
  param: Parameter | ParameterGroup,
  value: mixed
): true {
  const { type, required } = param;
  const valueIsNull = isNull(value);

  if (required && valueIsNull) {
    throw new ParameterNotNullableError(param);
  } else if (valueIsNull || !type) {
    return true;
  }

  const valueType = typeof value;
  let isValid = true;

  switch (type) {
    case 'array':
      isValid = Array.isArray(value);
      break;

    case 'buffer':
      isValid = isBuffer(value);
      break;

    case 'object':
      isValid = isObject(value) || isNull(value);
      break;

    case 'date':
      isValid = value instanceof Date;
      break;

    default:
      isValid = type === valueType;
  }

  if (!isValid) {
    throw new ParameterTypeError(param, valueType);
  }

  return isValid;
}
