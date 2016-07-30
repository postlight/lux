// @flow
import type { Validation$Validator, Validation$opts } from './interfaces';

/**
 * @private
 */
class Validation<T: Validation$Validator> {
  key: string;

  value: mixed;

  validator: Validation$Validator;

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
    });
  }

  isValid() {
    return this.validator(this.value);
  }
}

export default Validation;
