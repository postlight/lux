// @flow

/**
 * @private
 */
export default function pick<T: Object>(src: T, ...keys: Array<string>): T {
  // $FlowIgnore
  return keys
    .map((key): [string, mixed] => [key, src[key]])
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((obj, [key, value]) => {
      const result = obj;

      result[key] = value;

      return result;
    }, {});
}
