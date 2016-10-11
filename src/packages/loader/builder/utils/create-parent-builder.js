// @flow
import { getParentKey } from '../../resolver';
import type { Builder$Construct, Builder$ParentBuilder } from '../interfaces';

export default function createParentBuilder<T>(
  construct: Builder$Construct<T>
): Builder$ParentBuilder<T> {
  return target => Array
    .from(target)
    .sort(([a], [b]) => {
      if (a === 'root') {
        return -1;
      } else if (b === 'root') {
        return 1;
      }

      return Math.min(Math.max(a.length - b.length, -1), 1);
    })
    .reduce((result, [key, value]) => {
      let parent = value.get('application') || null;

      if (parent) {
        let grandparent = null;

        if (key !== 'root') {
          grandparent = result.find(namespace => (
            namespace.key === getParentKey(key)
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
