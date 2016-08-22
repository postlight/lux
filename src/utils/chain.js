// @flow
import type { Chain } from '../interfaces';

/**
 * @private
 */
export default function chain<T>(source: T): Chain<T> {
  return {
    pipe<U>(handler: (value: T) => U): Chain<U> {
      return chain(handler(source));
    },

    value(): T {
      return source;
    }
  };
}
