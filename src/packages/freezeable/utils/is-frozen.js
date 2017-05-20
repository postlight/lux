/* @flow */

import { FREEZER } from '../constants'

/**
 * @private
 */
export default function isFrozen<T>(value: T): boolean {
  return FREEZER.has(value)
}
