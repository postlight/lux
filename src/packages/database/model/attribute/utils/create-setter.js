// @flow
import type { Attribute$meta } from '../index';
import isNull from '../../../../../utils/is-null';
import isUndefined from '../../../../../utils/is-undefined';

import refsFor from './refs-for';

/**
 * @private
 */
export default function createSetter({
  key,
  nullable,
  normalize,
  defaultValue
}: Attribute$meta & {
  normalize: (value: any) => any
}): (value?: any) => void {
  return function setter(nextValue) {
    if (!nullable) {
      if (isNull(nextValue) || isUndefined(nextValue)) {
        return;
      }
    }

    const refs = refsFor(this);
    const valueToSet = normalize(nextValue);
    const currentValue = Reflect.get(refs, key) || defaultValue;

    if (valueToSet !== currentValue) {
      Reflect.set(refs, key, valueToSet);

      if (this.initialized) {
        const initialValue = this.initialValues.get(key) || defaultValue;

        if (valueToSet !== initialValue) {
          this.dirtyAttributes.add(key);
        } else {
          this.dirtyAttributes.delete(key);
        }
      } else {
        this.initialValues.set(key, valueToSet);
      }
    }
  };
}
