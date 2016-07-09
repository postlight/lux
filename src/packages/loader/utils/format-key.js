// @flow
import { dasherize } from 'inflection';

import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default function formatKey(
  key: string,
  formatter: ?(k: string) => string
): string {
  if (formatter) {
    key = Reflect.apply(formatter, null, [key]);
  }

  return dasherize(underscore(key));
}
