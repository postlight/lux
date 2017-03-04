/* @flow */

import entries from '../../../../utils/entries';

/**
 * @private
 */
export default function filterParams(
  params: Object,
  ...filtered: Array<string>
): Object {
  return entries(params)
    .map(([key, value]) => [
      key,
      filtered.indexOf(key) >= 0 ? '[FILTERED]' : value
    ])
    .reduce((result, [key, value]) => ({
      ...result,
      [key]: value && typeof value === 'object' && !Array.isArray(value)
        ? filterParams(value, ...filtered)
        : value
    }), {});
}
