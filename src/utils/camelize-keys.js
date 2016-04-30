import { camelize } from 'inflection';

const { entries } = Object;
const { isArray } = Array;

export default function camelizeKeys(obj, deep = false) {
  return isArray(obj) ? obj.slice() : entries(obj)
    .reduce((result, [key, value]) => {
      if (deep && value && typeof value === 'object' && !isArray(obj)) {
        value = camelizeKeys(value, true);
      }

      return {
        ...result,
        [camelize(key.replace(/-/g, '_'), true)]: value
      };
    }, {});
}
