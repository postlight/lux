// @flow
import isNull from './is-null';
import isObject from './is-object';

/**
 * @private
 */
export default function stringify(value?: ?mixed, spaces?: number): string {
  if (isObject(value) || Array.isArray(value)) {
    return JSON.stringify(value, null, spaces);
  } else if (isNull(value)) {
    return 'null';
  } else if (value && typeof value.toString === 'function') {
    return value.toString();
  } else {
    return 'undefined';
  }
}
