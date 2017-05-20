/* @flow */

/**
 * @private
 */
export default function isBuffer(value: mixed): boolean {
  return value instanceof Buffer
}
