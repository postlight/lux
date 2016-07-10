// @flow
import entries from './entries';

/**
 * A replacement for querystring.stringify that supports nested objects.
 *
 * @private
 */
export default function createQueryString(src: Object, prop?: string): string {
  return entries(src).reduce((result, [key, value], index) => {
    if (index > 0) {
      result += '&';
    }

    if (prop) {
      result += (
        prop
        + encodeURIComponent('[')
        + key
        + encodeURIComponent(']')
        + '='
      );
    } else {
      result += `${key}=`;
    }

    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        result += value.map(encodeURIComponent).join();
      } else {
        result = (
          result.substr(0, result.length - (key.length + 1))
          + createQueryString(value, key)
        );
      }
    } else if (!value && typeof value !== 'number') {
      result += 'null';
    } else {
      result += encodeURIComponent(value);
    }

    return result;
  }, '');
}
