// @flow
import type { Attribute$meta } from '../index';
import isNull from '../../../../utils/is-null';
import isUndefined from '../../../../utils/is-undefined';

export default function createGetter({
  key,
  defaultValue
}: Attribute$meta): () => any {
  return function getter() {
    let value = this.currentChangeSet.get(key);

    if (isNull(value) || isUndefined(value)) {
      value = defaultValue;
    }

    return value;
  };
}
