/* @flow */

import { isObject } from '@lux/utils/is-type'

/**
 * @private
 */
export default function stringify(value?: ?mixed, spaces?: number): string {
  switch (typeof value) {
    case 'string':
      return value

    case 'number':
      return String(value)

    case 'undefined':
      return 'undefined'

    default:
      return JSON.stringify(value, null, spaces)
  }
}

/**
 * @private
 */
export function circular(value?: ?mixed, spaces?: number): string {
  const cache = new WeakSet()

  switch (typeof value) {
    case 'string':
      return value

    case 'number':
      return String(value)

    case 'undefined':
      return 'undefined'

    default:
      return JSON.stringify(
        value,
        (key, val) => {
          if (isObject(val)) {
            if (cache.has(val)) {
              return undefined
            }
            cache.add(val)
          }
          return val
        },
        spaces,
      )
  }
}
