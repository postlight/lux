// @flow
import type Controller from '../../controller';

/**
 * @private
 */
export default function createReplacer(
  controllers: Map<string, Controller>
): RegExp {
  const names = Array
    .from(controllers)
    .map(([, { model }]) => model)
    .filter(Boolean)
    .map(({ resourceName }) => resourceName)
    .filter((str, idx, arr) => idx === arr.lastIndexOf(str))
    .join('|');

  return new RegExp(`(${names})/(\\d+)`, 'ig');
}
