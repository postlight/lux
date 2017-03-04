/* @flow */

export default function mapToObject<T>(
  source: Map<string, T>
): { [key: string]: T } {
  return Array
    .from(source)
    .reduce((obj, [key, value]) => ({
      ...obj,
      [String(key)]: value
    }), {});
}
