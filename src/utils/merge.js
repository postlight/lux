/* @flow */

import entries from './entries';
import setType from './set-type';
import isObject from './is-object';

function hasOwnProperty(target: Object, key: string): boolean {
  return Reflect.apply(Object.prototype.hasOwnProperty, target, [key]);
}

/**
 * @private
 */
export default function merge<T: Object, U: Object>(dest: T, source: U): T & U {
  return setType(() => entries(source).reduce((result, [key, value]) => {
    if (hasOwnProperty(result, key) && isObject(value)) {
      const currentValue = Reflect.get(result, key);

      if (isObject(currentValue)) {
        return {
          ...result,
          [key]: merge(currentValue, value)
        };
      }
    }

    return {
      ...result,
      [key]: value
    };
  }, {
    ...dest
  }));
}
