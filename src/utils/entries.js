// @flow
const METHOD_MISSING = typeof Object.entries !== 'function';

/**
 * @private
 */
export default function entries(source: Object): Array<[string, any]> {
  if (METHOD_MISSING) {
    const keys = Object.keys(source);
    const result = new Array(keys.length);

    return keys.reduce((prev, key, idx) => {
      const next = prev;
      const entry = new Array(2);

      entry[0] = key;
      entry[1] = source[key];

      // $FlowIgnore
      next[idx] = entry;

      return next;
    }, result);
  }

  return Object.entries(source);
}
