/* @flow */

import { MIME_TYPE } from '../../jsonapi'
import { STATUS_CODES } from '../../response'
import stringify from '../../../utils/stringify'

import dataFor from './data-for'

type ResponseData = {
  data: string;
  mimeType: string;
  statusCode: number;
}

/**
 * @private
 */
export default function normalize(content: any): ResponseData {
  let data
  let mimeType
  let statusCode

  switch (typeof content) {
    case 'boolean':
      mimeType = MIME_TYPE
      if (content) {
        statusCode = 204
      } else {
        statusCode = 401
        data = dataFor(statusCode)
      }
      break

    case 'number':
      mimeType = MIME_TYPE
      if (STATUS_CODES.has(content)) {
        statusCode = content
      } else {
        statusCode = 404
      }
      data = dataFor(statusCode)
      break

    case 'object':
      mimeType = MIME_TYPE
      if (content instanceof Error) {
        statusCode = Number.parseInt(content.statusCode, 10) || 500
        data = dataFor(statusCode, content)
      } else if (!content) {
        statusCode = 404
        data = dataFor(statusCode)
      } else {
        statusCode = 200
        data = content
      }
      break

    case 'undefined':
      statusCode = 404
      mimeType = MIME_TYPE
      data = dataFor(statusCode)
      break

    default:
      statusCode = 200
      mimeType = 'text/plain'
      data = content
  }

  data = stringify(data)

  return {
    data,
    mimeType,
    statusCode,
  }
}
