// @flow
import isNull from './is-null';
import entries from './entries';
import isUndefined from './is-undefined';

/**
 * @private
 */
export default function compact<T: Object | Array<mixed>>(source: T): T {
  if (Array.isArray(source)) {
    return source.filter(value => !isNull(value) && !isUndefined(value));
  }

  // $FlowIgnore
  return entries(source)
    .filter(([, value]) => !isNull(value) && !isUndefined(value))
    .reduce((obj, [key, value]) => {
      const result = obj;

      result[key] = value;

      return result;
    }, {});
}
