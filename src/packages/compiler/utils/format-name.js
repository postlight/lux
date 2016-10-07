// @flow
import { classify } from 'inflection';

import chain from '../../../utils/chain';
import underscore from '../../../utils/underscore';

import stripExt from './strip-ext';
import normalizePath from './normalize-path';

/**
 * @private
 */
function applyNamespace(source: string) {
  return source.replace('::', '$');
}

/**
 * @private
 */
export default function formatName(source: string) {
  return chain(source)
    .pipe(normalizePath)
    .pipe(stripExt)
    .pipe(underscore)
    .pipe(classify)
    .pipe(applyNamespace)
    .value();
}
