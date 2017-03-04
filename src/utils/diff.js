/* @flow */

/**
 * @private
 */
export function map<K, V>(a: Map<K, V>, b: Map<K, V>): Map<K, V> {
  return [...b].reduce((result, [key, value]) => (
    a.get(key) !== value ? result.set(key, value) : result
  ), new Map());
}
