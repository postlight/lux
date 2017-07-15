/* @flow */

import { FreezeableSet } from '@lux/packages/freezeable'
import validateType from '../utils/validate-type'

import validateValue from './utils/validate-value'
import type { Parameter$opts } from './interfaces'

/**
 * @private
 */
class Parameter extends FreezeableSet<mixed> {
  path: string

  type: string

  required: boolean

  sanitize: boolean

  constructor({ path, type, values, required, sanitize }: Parameter$opts) {
    super(values)

    Object.assign(this, {
      path,
      type,
      required: Boolean(required),
      sanitize: Boolean(sanitize),
    })

    this.freeze()
  }

  validate<V>(value: V): V {
    validateType(this, value)

    if (this.size > 0) {
      return validateValue(this, value)
    }

    return value
  }
}

export default Parameter
