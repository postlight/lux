/* @flow */

import { VERSION } from '@lux/packages/jsonapi'
import { STATUS_CODES } from '@lux/constants'
import * as env from '@lux/utils/env'
import type { Document, ErrorData } from '@lux/packages/jsonapi'

/**
 * @private
 */
function dataFor(status: number, err?: Error): string | Document {
  if (status < 400 || status > 599) {
    return ''
  }

  const title = STATUS_CODES.get(status)
  const errData: ErrorData = {
    status: String(status),
  }

  if (title) {
    errData.title = title
  }

  if (err && env.isDevelopment()) {
    errData.detail = err.message
  }

  return {
    errors: [errData],
    jsonapi: {
      version: VERSION,
    },
  }
}

export default dataFor
