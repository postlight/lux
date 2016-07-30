// @flow
import relatedFor from './related-for';

import type { Model } from '../../index';

/**
 * @private
 */
export default function saveRelationships(record: Model) {
  return Promise.all(
    Array.from(relatedFor(record).values())
      .reduce((relationships, related) => [
        ...relationships,
        ...(Array.isArray(related) ? related : [related])
      ], Array.from(record.prevAssociations))
      .filter(item => item.isDirty)
      .map(item => item.save())
  );
}
