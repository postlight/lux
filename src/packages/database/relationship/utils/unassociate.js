// @flow
import type { Model } from '../../index'; // eslint-disable-line no-unused-vars

function unassociateOne<T: void | ?Model>(value: T, foreignKey: string): T {
  if (value) {
    Reflect.set(value, foreignKey, null);
  }

  return value;
}

export default function unassociate<T: Model, U: void | ?T | Array<T>>(
  value: U,
  foreignKey: string
): U | Array<T> {
  if (Array.isArray(value)) {
    return value.map(record => unassociateOne(record, foreignKey));
  } else {
    return unassociateOne(value, foreignKey);
  }
}
