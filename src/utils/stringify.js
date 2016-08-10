// @flow
import isObject from './is-object';

/**
 * @private
 */
export default function stringify(value?: ?mixed, spaces?: number) {
  if (isObject(value) || Array.isArray(value)) {
    return JSON.stringify(value, null, spaces);
  } else {
    return String(value);
  }
}
