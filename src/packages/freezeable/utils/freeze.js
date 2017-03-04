/* @flow */

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
export function freezeValue<T: any>(value: T): T {
  if (value && typeof value.freeze === 'function') {
    return Object.freeze(value).freeze(true);
  } else if (isObject(value)) {
    return Object.freeze(value);
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
      value: Reflect.get(target, key),
      writable: false,
      enumerable: makePublic,
      configurable: false,
    }
  }), {}));

  return target;
}

/**
 * @private
 */
export function deepFreezeProps<T>(
  target: T,
  makePublic: boolean,
  ...props: Array<string>
): T {
  Object.defineProperties(target, props.reduce((obj, key) => {
    let value = Reflect.get(target, key);

    if (Array.isArray(value)) {
      value = freezeArray(value);
    } else {
      value = freezeValue(value);
    }

    return {
      ...obj,
      [key]: {
        value,
        writable: false,
        enumerable: makePublic,
        configurable: false,
      }
    };
  }, {}));

  return target;
}
