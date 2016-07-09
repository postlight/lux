// @flow
import entries from './entries';

/**
 * @private
 */
export default function omit(source: {}, ...omitted: Array<string>): Object {
  return entries(source)
    .filter(([key]) => omitted.indexOf(key) < 0)
    .reduce((result, [key, value]: [string, mixed]): {} => ({
      ...result,
      [key]: value
    }), {});
}
