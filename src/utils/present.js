/* @flow */

import { isNil } from '@lux/utils/is-type'

/**
 * @private
 */
export default function present(...values: Array<mixed>): boolean {
  return values.every(value => !isNil(value))
}
