// @flow
const HAS_OBJECT_ENTRIES = typeof Object.entries === 'function';

/**
 * @private
 */
export default function entries(source: Object): Array<[string, any]> {
  if (HAS_OBJECT_ENTRIES) {
    return Object.entries(source);
  }

  return Object.keys(source).reduce((result, key) => {
    const value = Reflect.get(source, key);

    result.push([key, value]);

    return result;
  }, []);
}
