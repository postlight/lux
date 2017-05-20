/* @flow */

import { MIME_TYPE } from '../constants'
import { line } from '../../logger'
import createServerError from '../../../errors/utils/create-server-error'

/**
 * @private
 */
class NotAcceptableError extends TypeError {
  constructor(contentType: string) {
    super(line`
      Media type parameters is not supported. Try your request again
      without specifying '${contentType.replace(MIME_TYPE, '')}'.
    `)
  }
}

export default createServerError(NotAcceptableError, 406)
