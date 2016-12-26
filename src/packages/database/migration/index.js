// @flow
import type { Migration$Fn } from './interfaces';

/**
 * @private
 */
class Migration<T: Object> {
  fn: Migration$Fn<T>;

  constructor(fn: Migration$Fn<T>) {
    this.fn = fn;
  }

  run(schema: T): T {
    return this.fn(schema);
  }
}

export default Migration;
export { default as generateTimestamp } from './utils/generate-timestamp';
export type { Migration$Fn } from './interfaces';
