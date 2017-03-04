/* @flow */

import isNull from '../../../../utils/is-null';
import isUndefined from '../../../../utils/is-undefined';
import type { Attribute$meta } from '../index';

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

    let { currentChangeSet: changeSet } = this;
    const valueToSet = normalize(nextValue);
    const currentValue = changeSet.get(key) || defaultValue;

    if (!changeSet.has(key) || valueToSet !== currentValue) {
      if (changeSet.isPersisted) {
        changeSet = changeSet.applyTo(this);
      }

      changeSet.set(key, valueToSet);
    }
  };
}
