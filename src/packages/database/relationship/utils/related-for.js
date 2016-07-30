// @flow
import type { Model } from '../../index';
import type { Relationship$refs } from '../interfaces';

const REFS: Relationship$refs = new WeakMap();

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
