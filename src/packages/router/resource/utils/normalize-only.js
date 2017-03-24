/* @flow */

import { BUILT_IN_ACTIONS } from '../../../controller';
// eslint-disable-next-line no-duplicate-imports
import type { BuiltInAction } from '../../../controller';

/**
 * @private
 */
function normalizeOnly(only: Array<BuiltInAction>): Array<BuiltInAction> {
  return BUILT_IN_ACTIONS.filter(action => only.includes(action));
}

export default normalizeOnly;
