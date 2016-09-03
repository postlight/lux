// @flow
import setType from '../../../../utils/set-type';

import type { Builder$Construct, Builder$ChildrenBuilder } from '../interfaces';

export default function createChildrenBuilder<T>(
  construct: Builder$Construct<T>
): Builder$ChildrenBuilder<T> {
  return target => target.map(({ key, value, parent }) => {
    return Array.from(value).map(([name, constructor]) => {
      if (parent && name === 'application') {
        return [name, setType(() => constructor)];
      } else {
        name = key === 'root' ? name : `${key}/${name}`;
        return [name, construct(name, constructor, parent)];
      }
    });
  });
}
