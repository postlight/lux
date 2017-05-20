/* @flow */

import { ParameterRequiredError } from '../../errors'
import type ParameterGroup from '../index'

/**
 * @private
 */
export default function hasRequiredParams(
  group: ParameterGroup,
  params: Object
): boolean {
  for (const [key, { path, required }] of group) {
    if (required && !Reflect.has(params, key)) {
      throw new ParameterRequiredError(path)
    }
  }

  return true
}
