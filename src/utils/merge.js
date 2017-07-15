/* @flow */

import { isObject } from '@lux/utils/is-type'

// $FlowFixMe
const merge = <T, U>(dest: T, source: U): { ...T, ...U } =>
  Object.entries(dest)
    .concat(Object.entries(source))
    .reduce((prev, [key, value]) => {
      const currentValue = prev[key]
      const next = prev

      if (isObject(currentValue) && isObject(value)) {
        next[key] = merge(currentValue, value)
      } else {
        next[key] = value
      }

      return next
    }, {})

export default merge
