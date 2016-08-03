// @flow
import { camelize } from 'inflection';

import underscore from '../../../utils/underscore';
import template from '../../template';

/**
 * @private
 */
export default (name: string): string => {
  name = camelize(underscore(name), true);

  return template`
    export default function ${name}(/*request, response*/) {

    }
  `;
};
