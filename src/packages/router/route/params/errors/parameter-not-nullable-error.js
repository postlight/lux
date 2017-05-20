/* @flow */

import createServerError from '../../../../../errors/utils/create-server-error'
import type { ParameterLike } from '../index'

/**
 * @private
 */
class ParameterNotNullableError extends TypeError {
  constructor({ path }: ParameterLike) {
    super(`Parameter '${path}' is not nullable.`)
  }
}

export default createServerError(ParameterNotNullableError, 400)
