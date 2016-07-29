// @flow
import relatedFor from './related-for';

import type { Model } from '../../index';

/**
 * @private
 */
export default function saveRelationships(record: Model) {
  return Promise.all(
    Array.from(relatedFor(record).values())
      .map(related => {
        if (Array.isArray(related)) {
          return related.filter(item => item.isDirty);
        } else {
          return [related];
        }
      })
      .filter(related => related.length)
      .map(related => Promise.all(related.map(item => item.save())))
  );
}
