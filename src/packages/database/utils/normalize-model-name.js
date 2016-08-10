// @flow
import { dasherize, singularize } from 'inflection';

import underscore from '../../../utils/underscore';

/**
 * @private
 */
export default function normalizeModelName(modelName: string) {
  return singularize(dasherize(underscore(modelName)));
}
