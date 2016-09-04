// @flow
import { REQUEST_METHODS } from '../../../../server';

import createDefinition from './create-definition';

import type { Route$type, Router$Namespace } from '../../../index'; // eslint-disable-line max-len, no-unused-vars

/**
 * @private
 */
export default function createDefinitionGroup<T: Router$Namespace>(
  type: Route$type,
  namespace: T
) {
  return REQUEST_METHODS.reduce((methods, method) => ({
    ...methods,
    [method.toLowerCase()]: createDefinition({
      type,
      method,
      namespace
    })
  }), {});
}
