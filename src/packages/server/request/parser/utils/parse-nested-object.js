// @flow
import entries from '../../../../../utils/entries';

const DELIMITER = /^(.+)\[(.+)\]$/g;

/**
 * @private
 */
export default function parseNestedObject(source: Object): Object {
  return entries(source).reduce((result, [key, value]) => {
    if (DELIMITER.test(key)) {
      const parentKey = key.replace(DELIMITER, '$1');
      const parentValue = result[parentKey];

      return {
        ...result,

        [parentKey]: {
          ...(parentValue || {}),
          [key.replace(DELIMITER, '$2')]: value
        }
      };
    } else {
      return {
        ...result,
        [key]: value
      };
    }
  }, {});
}
