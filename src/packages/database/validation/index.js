/* @flow */

import type { Validation$opts } from './interfaces'

/**
 * @private
 */
class Validation<T> {
  key: string;

  value: T;

  validator: (value?: T) => boolean;

  constructor(opts: Validation$opts<T>) {
    Object.defineProperties(this, {
      key: {
        value: opts.key,
        writable: false,
        enumerable: true,
        configurable: false
      },

      value: {
        value: opts.value,
        writable: false,
        enumerable: true,
        configurable: false
      },

      validator: {
        value: opts.validator,
        writable: false,
        enumerable: false,
        configurable: false
      }
    })
  }

  isValid(): boolean {
    return this.validator(this.value)
  }
}

export default Validation
export { ValidationError } from './errors'
