// @flow

/**
 * @private
 */
export default function insert<T, U: Array<T>>(target: U, items: Array<T>): U {
  for (let i = 0; i < items.length; i++) {
    target[i] = items[i];
  }

  return target;
}
