// @flow

/**
 * @private
 */
export default function insert<T, U: Array<T>>(target: U, items: Array<T>): U {
  for (let i = 0; i < items.length; i += 1) {
    target.splice(i, 1, items[i]);
  }

  return target;
}
