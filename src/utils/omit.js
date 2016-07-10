// @flow
import entries from './entries';

/**
 * @private
 */
export default function omit(src: Object, ...omitted: Array<string>): Object {
  return entries(src)
    .filter(([key]) => omitted.indexOf(key) < 0)
    .reduce((result, [key, value]: [string, mixed]): {} => ({
      ...result,
      [key]: value
    }), {});
}
