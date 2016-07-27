// @flow
import setType from './set-type';

/**
 * @private
 */
export default function pick<T: Object>(src: T, ...keys: Array<string>): T {
  return setType(() => keys
    .map((key): [string, mixed] => [key, Reflect.get(src, key)])
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((result, [key, value]) => ({
      ...result,
      [key]: value
    }), {}));
}
