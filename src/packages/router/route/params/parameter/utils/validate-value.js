/* @flow */

import { isNull } from '@lux/utils/is-type'
import { ParameterValueError, ResourceMismatchError } from '../../errors'
import type Parameter from '../index'

/**
 * @private
 */
function validateOne<V>(param: Parameter, value: V): V {
  if (!param.required && isNull(value)) {
    return value
  }

  if (!param.has(value)) {
    let expected

    switch (param.path) {
      case 'data.type':
        ;[expected] = [...param.values()]
        throw new ResourceMismatchError(param.path, expected, value)

      default:
        throw new ParameterValueError(param, value)
    }
  }

  return value
}

/**
 * @private
 */
export default function validateValue<V>(param: Parameter, value: V): V {
  if (Array.isArray(value)) {
    if (param.sanitize) {
      return value.filter(item => param.has(item))
    }

    value.forEach(item => validateOne(param, item))
  } else {
    validateOne(param, value)
  }

  return value
}
