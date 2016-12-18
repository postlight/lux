// @flow
import entries from './entries';
import isObject from './is-object';
import hasOwnProperty from './has-own-property';

/**
 * @private
 */
export default function merge<T: Object, U: Object>(dest: T, source: U): T & U {
  // $FlowIgnore
  return entries(source).reduce((obj, [key, value]) => {
    const result = obj;
    let mergeValue = value;

    if (hasOwnProperty(result, key) && isObject(value)) {
      const currentValue = result[key];

      if (isObject(currentValue)) {
        mergeValue = merge(currentValue, value);
      }
    }

    result[key] = mergeValue;

    return result;
  }, { ...dest });
}
