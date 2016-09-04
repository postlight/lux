// @flow
import { BUILT_IN_ACTIONS } from '../../../controller';

import type { Controller$builtIn } from '../../../controller';

/**
 * @private
 */
export default function normalizeOnly(only: Array<Controller$builtIn>) {
  return only.filter(action => BUILT_IN_ACTIONS.indexOf(action) >= 0);
}
