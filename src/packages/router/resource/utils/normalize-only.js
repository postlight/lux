/* @flow */

import { BUILT_IN_ACTIONS } from '@lux/packages/controller'
import type { BuiltInAction } from '@lux/packages/controller'

/**
 * @private
 */
function normalizeOnly(only: Array<BuiltInAction>): Array<BuiltInAction> {
  return BUILT_IN_ACTIONS.filter(action => only.includes(action))
}

export default normalizeOnly
