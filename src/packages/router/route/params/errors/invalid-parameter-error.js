/* @flow */

import createServerError from '../../../../../errors/utils/create-server-error'

/**
 * @private
 */
class InvalidParameterError extends TypeError {
  constructor(path: string) {
    super(`'${path}' is not a valid parameter for this resource.`)
  }
}

export default createServerError(InvalidParameterError, 400)
