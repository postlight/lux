// @flow
import entries from './entries';

/**
 * @private
 */
export default function omit<T: Object>(src: T, ...omitted: Array<string>): T {
  // $FlowIgnore
  return entries(src)
    .filter(([key]) => omitted.indexOf(key) < 0)
    .reduce((obj, [key, value]) => {
      const result = obj;

      result[key] = value;

      return result;
    }, {});
}
