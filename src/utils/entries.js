// @flow

/**
 * @private
 */
export default function entries(src: Object): Array<[string, any]> {
  return Object.keys(src).reduce((result, key) => {
    result[result.length] = [key, Reflect.get(src, key)];
    return result;
  }, []);
}
