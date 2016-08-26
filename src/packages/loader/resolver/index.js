// @flow
import { FreezeableMap } from '../../freezeable';

import type { Bundle$Namespace, Bundle$NamespaceGroup } from '../index';

/**
 * @private
 */
export function resolve<T>(
  group: Bundle$Namespace<T>
): Bundle$NamespaceGroup<T> {
  return Array
    .from(group)
    .map(([key, value]) => {
      let namespace = key.split('/');

      namespace = namespace
        .slice(0, Math.max(namespace.length - 1, 0))
        .join('/');

      if (namespace) {
        key = key.substr(namespace.length + 1);
      } else {
        namespace = 'root';
      }

      return [key, value, namespace];
    })
    .reduce((map, [key, value, namespace]) => {
      let nsValue = map.get(namespace);

      if (!nsValue) {
        nsValue = new FreezeableMap();
      }

      return map.set(namespace, nsValue.set(key, value));
    }, new FreezeableMap());
}

export { default as getParentKey } from './utils/get-parent-key';
export { default as stripNamespaces } from './utils/strip-namespaces';
export { default as closestAncestor } from './utils/closest-ancestor';
