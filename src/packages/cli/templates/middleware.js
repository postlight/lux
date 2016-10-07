// @flow
import { camelize } from 'inflection';

import chain from '../../../utils/chain';
import underscore from '../../../utils/underscore';
import template from '../../template';

/**
 * @private
 */
export default (name: string): string => {
  const normalized = chain(name)
    .pipe(underscore)
    .pipe(str => camelize(str, true))
    .value();

  return template`
    export default function ${normalized}(/*request, response*/) {

    }
  `;
};
