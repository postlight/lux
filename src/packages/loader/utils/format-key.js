// @flow
import { dasherize } from 'inflection';

import chain from '../../../utils/chain';
import underscore from '../../../utils/underscore';

const NAMESPACE_DELIMITER = /\$\-/;

/**
 * @private
 */
export default function formatKey(
  key: string,
  formatter?: (source: string) => string
) {
  return chain(key)
    .pipe(str => formatter ? formatter(str) : str)
    .pipe(underscore)
    .pipe(dasherize)
    .pipe(str => str.replace(NAMESPACE_DELIMITER, '\/'))
    .value();
}
