/* @flow */

import type { Model } from '../../index'; // eslint-disable-line no-unused-vars

/**
 * @private
 */
function unassociateOne<T: void | ?Model>(value: T, foreignKey: string): T {
  if (value) {
    Reflect.set(value, foreignKey, null);
  }

  return value;
}

/**
 * @private
 */
export default function unassociate<T: Model, U: Array<T>>(
  value: U,
  foreignKey: string
): U | Array<T> {
  return value.map(record => unassociateOne(record, foreignKey));
}
