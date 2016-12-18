// @flow
const HAS_OBJECT_ENTRIES = typeof Object.entries === 'function';

/**
 * @private
 */
export default function entries(source: Object): Array<[string, any]> {
  if (HAS_OBJECT_ENTRIES) {
    return Object.entries(source);
  }

  const keys = Object.keys(source);

  return keys.reduce((prev, key) => {
    const next = prev;
    const entry = new Array(2);

    entry[0] = key;
    entry[1] = source[key];

    // $FlowIgnore
    next[next.length] = entry;

    return next;
  }, new Array(keys.length));
}
