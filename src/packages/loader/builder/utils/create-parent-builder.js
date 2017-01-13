// @flow
import { posix } from 'path';

import type { Builder$Construct, Builder$ParentBuilder } from '../interfaces';

import sortByNamespace from './sort-by-namespace';

export default function createParentBuilder<T>(
  construct: Builder$Construct<T>
): Builder$ParentBuilder<T> {
  return target => Array
    .from(target)
    .sort(sortByNamespace)
    .reduce((result, [key, value]) => {
      let parent = value.get('application') || null;

      if (parent) {
        let grandparent = null;

        if (key !== 'root') {
          grandparent = result.find(namespace => (
            namespace.key === posix.dirname(key)
          ));

          if (grandparent) {
            grandparent = grandparent.parent;
          }
        }

        parent = construct(`${key}/application`, parent, grandparent);
      }

      return [...result, {
        key,
        value,
        parent
      }];
    }, []);
}
