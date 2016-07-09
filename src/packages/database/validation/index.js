// @flow
import typeof Model from '../model';

class Validation {
  key: string;

  value: mixed;

  model: Model;

  validator: () => boolean;

  constructor({
    key,
    value,
    model,
    validator = () => true
  }: {
    key: string,
    value: mixed,
    model: Model,
    validator: () => boolean
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

      model: {
        value: model,
        writable: false,
        enumerable: false,
        configurable: false
      },

      validator: {
        value: validator,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    return this;
  }

  get isValid(): boolean {
    const {
      model,
      value,
      validator
    } = this;

    return Reflect.apply(validator, model, [value]);
  }
}

export default Validation;
