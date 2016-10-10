// @flow
import { camelize } from 'inflection';

import chain from '../../../utils/chain';
import underscore from '../../../utils/underscore';

import stripExt from './strip-ext';
import normalizePath from './normalize-path';

const DOUBLE_COLON = /::/g;

/**
 * @private
 */
function applyNamespace(source: string) {
  return source.replace(DOUBLE_COLON, '$');
}

/**
 * @private
 */
export default function formatName(source: string) {
  return chain(source)
    .pipe(normalizePath)
    .pipe(stripExt)
    .pipe(underscore)
    .pipe(camelize)
    .pipe(applyNamespace)
    .value();
}
