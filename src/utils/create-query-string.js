// @flow
import entries from './entries';

/**
 * A replacement for querystring.stringify that supports nested objects.
 *
 * @private
 */
export default function createQueryString(
  source: Object,
  property?: string
): string {
  return entries(source).reduce((result, [key, value], index, arr) => {
    if (index > 0) {
      result += '&';
    }

    if (property) {
      result += (
        property
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
