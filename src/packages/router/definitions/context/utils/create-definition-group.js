// @flow
import type { Route$type, Router$Namespace } from '../../../index'; // eslint-disable-line max-len, no-unused-vars
import type { Router$Definition } from '../../interfaces';

import createDefinition from './create-definition';

type Router$DefinitionGroup = {
  get: Router$Definition;
  head: Router$Definition;
  post: Router$Definition;
  patch: Router$Definition;
  delete: Router$Definition;
  options: Router$Definition;
};

/**
 * @private
 */
export default function createDefinitionGroup<T: Router$Namespace>(
  type: Route$type,
  namespace: T
): Router$DefinitionGroup {
  return {
    get: createDefinition({
      type,
      namespace,
      method: 'GET'
    }),
    head: createDefinition({
      type,
      namespace,
      method: 'HEAD'
    }),
    post: createDefinition({
      type,
      namespace,
      method: 'POST'
    }),
    patch: createDefinition({
      type,
      namespace,
      method: 'PATCH'
    }),
    delete: createDefinition({
      type,
      namespace,
      method: 'DELETE'
    }),
    options: createDefinition({
      type,
      namespace,
      method: 'OPTIONS'
    })
  };
}
