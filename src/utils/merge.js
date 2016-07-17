// @flow
import entries from './entries';
import isObject from './is-object';

export default function merge<T: Object, U: Object>(dest: T, source: U): T {
  return entries(source).reduce((result, [key, value]) => {
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
  });
}
