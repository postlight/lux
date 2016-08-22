// @flow
import { classify } from 'inflection';

import chain from '../../../utils/chain';
import underscore from '../../../utils/underscore';

const EXT_PATTERN = /\.js$/;

/**
 * @private
 */
function applyNamespace(source: string) {
  return source.replace('::', '$');
}

/**
 * @private
 */
export function stripExt(source: string) {
  return source.replace(EXT_PATTERN, '');
}

/**
 * @private
 */
export default function formatName(source: string) {
  return chain(source)
    .pipe(stripExt)
    .pipe(underscore)
    .pipe(classify)
    .pipe(applyNamespace)
    .value();
}
