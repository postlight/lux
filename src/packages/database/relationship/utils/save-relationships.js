// @flow
import relatedFor from './related-for';

import type { Model } from '../../index';

/**
 * @private
 */
export default async function saveRelationships(record: Model) {
  let relationships = [
    ...Array.from(record.prevAssociations),
    ...Array.from(relatedFor(record).values())
  ];

  relationships = relationships
    .map(related => {
      if (Array.isArray(related)) {
        return related.filter(item => item.isDirty);
      } else {
        return related ? [related] : [];
      }
    })
    .filter(related => related.length)
    .map(related => {
      related = related.map(item => item.save());

      return Promise.all(related);
    });

  return await Promise.all(relationships);
}
