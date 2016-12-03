// @flow
import type { Attribute$meta } from '../index';
import isNull from '../../../../utils/is-null';
import isUndefined from '../../../../utils/is-undefined';

import refsFor from './refs-for';

export default function createGetter({
  key,
  defaultValue
}: Attribute$meta): () => any {
  return function getter() {
    const refs = refsFor(this);
    let value = Reflect.get(refs, key);

    if (isNull(value) || isUndefined(value)) {
      value = defaultValue;
    }

    return value;
  };
}
