// @flow
import { FREEZER } from '../constants';
import insert from '../../../utils/insert';
import isObject from '../../../utils/is-object';

/**
 * @private
 */
export default function freeze<T>(value: T): T {
  FREEZER.add(value);
  return value;
}

/**
 * @private
 */
export function freezeArray<T>(target: Array<T>): Array<T> {
  const result = insert(new Array(target.length), target);

  return Object.freeze(result);
}

/**
 * @private
 */
export function freezeValue<T>(value: T | Array<T>): T | Array<T> {
  if (isObject(value)) {
    Object.freeze(value);
  } else if (Array.isArray(value)) {
    return freezeArray(value);
  } else if (value && typeof value.freeze === 'function') {
    value.freeze();
  }

  return value;
}

/**
 * @private
 */
export function freezeProps<T>(
  target: T,
  makePublic: boolean,
  ...props: Array<string>
): T {
  Object.defineProperties(target, props.reduce((obj, key) => ({
    ...obj,
    [key]: {
      value: freezeValue(Reflect.get(target, key)),
      writable: false,
      enumerable: makePublic,
      configurable: false,
    }
  }), {}));

  return target;
}
