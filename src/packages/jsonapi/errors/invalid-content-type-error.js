/* @flow */

import { MIME_TYPE } from '../constants'
import { line } from '../../logger'
import createServerError from '../../../errors/utils/create-server-error'

/**
 * @private
 */
class InvalidContentTypeError extends TypeError {
  constructor(contentType?: string = 'undefined') {
    super(line`
      Content-Type: '${contentType}' is not supported. Try your request again
      with Content-Type: '${MIME_TYPE}'.
    `)
  }
}

export default createServerError(InvalidContentTypeError, 400)
