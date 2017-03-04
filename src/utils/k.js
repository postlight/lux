/* @flow */

/**
 * A utility function that always returns `this` based on it's current
 * context.
 *
 * A common use case for the K function is a default parameter for optional
 * callback functions or general function arguments.
 *
 * @private
 */
export default function K(): any {
  return this;
}
