// @flow
import entries from './entries';
import isNull from './is-null';
import isUndefined from './is-undefined';

/**
 * @private
 */
export default function compact<T: Object | Array<mixed>>(
  source: T
): T | Object {
  if (Array.isArray(source)) {
    return source.filter(value => !isNull(value) && !isUndefined(value));
  } else {
    return entries(source)
      .filter(([, value]) => !isNull(value) && !isUndefined(value))
      .reduce((result, [key, value]) => ({
        ...result,
        [key]: value
      }), {});
  }
}
