// @flow
import type Model from '../../model';

const REFS: WeakMap<Model, Map<string, Model>> = new WeakMap();

/**
 * @private
 */
export default function relatedFor(owner: Model) {
  let related = REFS.get(owner);

  if (!related) {
    related = new Map();
    REFS.set(owner, related);
  }

  return related;
}
