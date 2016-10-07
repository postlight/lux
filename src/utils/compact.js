// @flow
import isNull from './is-null';
import entries from './entries';
import setType from './set-type';
import isUndefined from './is-undefined';

/**
 * @private
 */
export default function compact<T: Object | Array<mixed>>(source: T): T {
  return setType(() => {
    if (Array.isArray(source)) {
      return source.filter(value => !isNull(value) && !isUndefined(value));
    }

    return entries(source)
      .filter(([, value]) => !isNull(value) && !isUndefined(value))
      .reduce((result, [key, value]) => ({
        ...result,
        [key]: value
      }), {});
  });
}
