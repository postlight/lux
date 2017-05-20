/* @flow */

import hasOwnProperty from './has-own-property'

type Proxy$get<T> = (target: T, key: string, receiver: Proxy<T>) => any;

/**
 * @private
 */
export function trapGet<T>(traps: Object): Proxy$get<T> {
  return (target, key, receiver) => {
    if (key === 'unwrap') {
      return () => target
    }

    if (hasOwnProperty(traps, key)) {
      const value = Reflect.get(traps, key)

      if (typeof value === 'function') {
        return value.bind(receiver, target)
      }

      return value
    }

    return Reflect.get(target, key)
  }
}
