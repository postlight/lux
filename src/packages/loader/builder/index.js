// @flow
import { FreezeableMap } from '../../freezeable';
import { resolve } from '../resolver';
import chain from '../../../utils/chain';
import type { Bundle$Namespace, Bundle$NamespaceGroup } from '../index'; // eslint-disable-line max-len, no-unused-vars

import createParentBuilder from './utils/create-parent-builder';
import createChildrenBuilder from './utils/create-children-builder';
import type { Builder$Construct } from './interfaces';

/**
 * @private
 */
export function build<T>(
  group: Bundle$Namespace<Class<T>>,
  construct: Builder$Construct<T>
): Bundle$Namespace<T> {
  return chain(group)
    .pipe(resolve)
    .pipe(createParentBuilder(construct))
    .pipe(createChildrenBuilder(construct))
    .pipe(arr => arr.reduce((result, value) => [...result, ...value], []))
    .construct(FreezeableMap)
    .value();
}
