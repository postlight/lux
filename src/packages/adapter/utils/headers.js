/* @flow */

import entries from '../../../utils/entries'
import { FreezeableMap } from '../../freezeable'
import type { ObjectMap } from '../../../interfaces'

type HandleChange = (type: 'SET' | 'DELETE', data: [string, ?string]) => void;

export class Headers extends FreezeableMap<string, string> {
  constructor(value: ObjectMap<string> = {}) {
    super(entries(value))
  }

  get(key: string): void | string {
    return super.get(String(key).toLowerCase())
  }

  has(key: string): boolean {
    return super.has(String(key).toLowerCase())
  }

  set(key: string, value: string): this {
    super.set(String(key).toLowerCase(), value)
    return this
  }

  delete(key: string): boolean {
    return super.delete(String(key).toLowerCase())
  }
}

export class ResponseHeaders extends Headers {
  handleChange: HandleChange;

  constructor(handleChange: HandleChange) {
    super()
    this.handleChange = handleChange
  }

  set(key: string, value: string): this {
    this.handleChange('SET', [key, value])
    return super.set(key, value)
  }

  delete(key: string): boolean {
    this.handleChange('DELETE', [key, null])
    return super.delete(key)
  }
}
