/* @flow */

/**
 * @private
 */
export default function sleep(amount: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, amount))
}
