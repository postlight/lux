// @flow

/**
 * @private
 */
export function map<K, V>(a: Map<K, V>, b: Map<K, V>): Map<K, V> {
  return Array
    .from(b)
    .reduce((result, [key, value]) => {
      if (a.get(key) !== value) {
        result.set(key, value);
      }

      return result;
    }, new Map());
}
