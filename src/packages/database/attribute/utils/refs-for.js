// @flow
import type { Model } from '../../index';

export const REFS: WeakMap<Model, Object> = new WeakMap();

/**
 * @private
 */
export default function refsFor(instance: Model) {
  let table = REFS.get(instance);

  if (!table) {
    table = Object.create(null);
    REFS.set(instance, table);
  }

  return table;
}
