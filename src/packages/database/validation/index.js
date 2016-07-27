// @flow

/**
 * @private
 */
class Validation<T: () => boolean> {
  key: string;

  value: mixed;

  validator: T;

  constructor({
    key,
    value,
    validator
  }: {
    key: string,
    value: mixed,
    validator: T
  } = {}) {
    Object.defineProperties(this, {
      key: {
        value: key,
        writable: false,
        enumerable: true,
        configurable: false
      },

      value: {
        value,
        writable: false,
        enumerable: true,
        configurable: false
      },

      validator: {
        value: validator,
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
