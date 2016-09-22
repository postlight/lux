// @flow
import setType from '../../../../utils/set-type';

import type { Builder$Construct, Builder$ChildrenBuilder } from '../interfaces';

export default function createChildrenBuilder<T>(
  construct: Builder$Construct<T>
): Builder$ChildrenBuilder<T> {
  return target => target.map(({ key, value, parent }) => {
    return Array.from(value).map(([name, constructor]) => {
      name = key === 'root' ? name : `${key}/${name}`;

      if (parent && name.endsWith('application')) {
        return [name, setType(() => constructor)];
      } else {
        return [name, construct(name, constructor, parent)];
      }
    });
  });
}
