// @flow
import entries from '../../../../../utils/entries';

const DELIMITER = /^(.+)\[(.+)]$/g;

/**
 * @private
 */
export default function parseNestedObject(source: Object): Object {
  return entries(source).reduce((obj, [key, value]) => {
    const result = obj;

    if (DELIMITER.test(key)) {
      const parentKey = key.replace(DELIMITER, '$1');
      let parentValue = result[parentKey];

      if (!parentValue) {
        parentValue = {};
        result[parentKey] = parentValue;
      }

      parentValue[key.replace(DELIMITER, '$2')] = value;
    } else {
      result[key] = value;
    }

    return result;
  }, {});
}
