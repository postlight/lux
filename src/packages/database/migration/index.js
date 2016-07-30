// @flow

/**
 * @private
 */
class Migration<T: (schema: Object) => Promise<void>> {
  fn: T;

  constructor(fn: T) {
    this.fn = fn;
  }

  run(schema: Object) {
    return this.fn(schema);
  }
}

export default Migration;
export { default as generateTimestamp } from './utils/generate-timestamp';
