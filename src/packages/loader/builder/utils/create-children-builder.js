// @flow
import chain from '../../../../utils/chain';

import type { Builder$Construct, Builder$ChildrenBuilder } from '../interfaces';

export default function createChildrenBuilder<T>(
  construct: Builder$Construct<T>
): Builder$ChildrenBuilder<T> {
  return target => target.map(({ key, value, parent }) => {
    return chain(value)
      .pipe(Array.from)
      .pipe(arr => arr.map(([name, constructor]) => {
        if (parent && name === 'application') {
          return [name, construct(name, constructor, parent)];
        } else {
          name = key === 'root' ? name : `${key}/${name}`;
          return [name, construct(name, constructor, parent)];
        }
      }))
      .value();
  });
}
