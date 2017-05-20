/* @flow */

import { METHODS } from '../../../../request'
import type { Method } from '../../../../request'
// eslint-disable-next-line no-unused-vars
import type { Route$type, Router$Namespace } from '../../../index'

import createDefinition from './create-definition'

/**
 * @private
 */
type DefinitionGroup = {
  [key: Method]: (name: string, action?: string) => void;
};

/**
 * @private
 */
function createDefinitionGroup<T: Router$Namespace>(
  type: Route$type,
  namespace: T
): DefinitionGroup {
  return Array
    .from(METHODS)
    .reduce((methods, method) => ({
      ...methods,
      [method.toLowerCase()]: (
        createDefinition({
          type,
          method,
          namespace,
        })
      ),
    }), {})
}

export default createDefinitionGroup
