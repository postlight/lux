// @flow
import { insertValues } from '../../template';

const PATTERN = /(?:,?`|'|").+(?:`|'|"),?/;

/**
 * @private
 */
export default function sql(
  strings: Array<string>,
  ...values: Array<mixed>
): string {
  return insertValues(strings, ...values)
    .split(' ')
    .map(part => {
      if (PATTERN.test(part)) {
        return part;
      }

      return part.toUpperCase();
    })
    .join(' ');
}
