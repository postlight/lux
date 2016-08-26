// @flow
import { getParentKey } from '../../resolver';

import chain from '../../../../utils/chain';

import type { Builder$Construct, Builder$ParentBuilder } from '../interfaces';

export default function createParentBuilder<T>(
  construct: Builder$Construct<T>
): Builder$ParentBuilder<T> {
  return target => chain(target)
    .pipe(Array.from)
    .pipe(arr => arr.reduce((result, [key, value]) => {
      const parent = value.get('application');

      return [...result, {
        key,
        value,
        parent: parent ? construct('application', parent) : null
      }];
    }, []))
    .pipe(arr => {
      return arr.reduce((result, { key, value, parent }, idx, input) => {
        if (key !== 'root' && parent) {
          const grandparent = input.find(namespace => {
            return namespace.key === getParentKey(key);
          });

          if (grandparent) {
            Reflect.defineProperty(parent, 'parent', {
              value: grandparent.parent,
              writable: true,
              enumerable: false,
              configurable: false
            });
          }
        }

        return [...result, {
          key,
          value,
          parent
        }];
      }, []);
    })
    .value();
}
