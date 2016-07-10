// @flow

/**
 * @private
 */
export default function pick(src: Object, ...keys: Array<string>): Object {
  return keys
    .map((key): [string, mixed] => [key, Reflect.get(src, key)])
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((result, [key, value]) => ({
      ...result,
      [key]: value
    }), {});
}
