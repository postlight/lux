// @flow

/**
 * @private
 */
export default function pick(source: {}, ...keys: Array<string>): Object {
  return keys
    .map((key): [string, mixed] => [key, source[key]])
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((result, [key, value]) => ({
      ...result,
      [key]: value
    }), {});
}
