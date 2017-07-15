/* @flow */

import type { Bundle$Namespace } from '../../index'

/**
 * @private
 */
export default function sortByNamespace<T>(
  [a]: [string, Bundle$Namespace<T>],
  [b]: [string, Bundle$Namespace<T>],
): number {
  if (a === 'root') {
    return -1
  } else if (b === 'root') {
    return 1
  }

  return Math.min(Math.max(a.length - b.length, -1), 1)
}
