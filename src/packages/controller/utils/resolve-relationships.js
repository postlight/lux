// @flow
import entries from '../../../utils/entries';
// eslint-disable-next-line no-unused-vars
import type { Model } from '../../database';

/**
 * @private
 */
export default function resolveRelationships<T: Model>(
  model: Class<T>,
  relationships: Object = {}
): Object {
  return entries(relationships).reduce((obj, [key, value]) => {
    const result = obj;

    if (value && value.data) {
      const opts = model.relationshipFor(key);

      if (opts) {
        /* eslint-disable new-cap */
        if (Array.isArray(value.data)) {
          result[key] = value.data.map(item => new opts.model(item));
        } else {
          result[key] = new opts.model(value.data);
        }
        /* eslint-enable new-cap */

        return result;
      }
    }

    result[key] = null;

    return result;
  }, {});
}
