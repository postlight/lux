// @flow
import type { Attribute$meta } from '../index';

import refsFor from './refs-for';

export default function createGetter({
  key,
  defaultValue
}: Attribute$meta): () => any {
  return function getter() {
    const refs = refsFor(this);

    return Reflect.get(refs, key) || defaultValue;
  };
}
