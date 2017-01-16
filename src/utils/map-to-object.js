// @flow
import type { ObjectMap } from '../interfaces';

export default function mapToObject<K, V>(source: Map<K, V>): ObjectMap<K, V> {
  return Array
    .from(source)
    .reduce((obj, [key, value]) => {
      const result = obj;

      result[String(key)] = value;

      return result;
    }, {});
}
