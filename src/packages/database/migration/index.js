/* @flow */

export type Migratator<T> = (schema: T) => Promise<T>

export { generate as generateTimestamp } from './timestamp'

export default class Migration<T> {
  fn: Migratator<T>

  constructor(fn: Migratator<T>) {
    this.fn = fn
  }

  run(schema: T): Promise<T> {
    return this.fn(schema)
  }
}
