// @flow
import entries from './entries';
import setType from './set-type';
import isObject from './is-object';

/**
 * @private
 */
export default function merge<T: Object, U: Object>(dest: T, source: U): T & U {
  return setType(() => entries(source).reduce((result, [key, value]) => {
    if (result.hasOwnProperty(key) && isObject(value)) {
      const currentValue = result[key];

      if (isObject(currentValue)) {
        value = merge(currentValue, value);
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
