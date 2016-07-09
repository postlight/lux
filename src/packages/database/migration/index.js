// @flow

/**
 * @private
 */
class Migration {
  fn: (schema: Object) => Promise<void>;

  constructor(fn: (schema: Object) => Promise<void>): Migration {
    Reflect.defineProperty(this, 'fn', {
      value: fn,
      writeable: false,
      enumerable: false,
      configurable: false
    });

    return this;
  }

  run(schema: Object): Promise<void> {
    return Reflect.apply(this.fn, null, [schema]);
  }
}

export default Migration;
