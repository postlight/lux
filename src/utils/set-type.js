/* @flow */


/**
 * Use this util as a brute force way of tricking flow into understanding intent
 * to extend or combine a type in a polymorphic function.
 *
 * In essence, this function allows you to declare your types for a high order
 * function that wraps the inner logic of this function without flow throwing
 * any type errors. This allows you to properly set the return value of the
 * high order function to whatever you like so consumers of the high order
 * function can still benifit from type inference and safety as long as the
 * return value type declaration is 100% accurate.
 *
 * WARNING:
 * This function should rarely be used as it requires a good understanding of
 * the flow type system to ensure that the function this util wraps is still
 * type safe.
 *
 * @private
 */
export default function setType(fn: () => any): any {
  return fn();
}
