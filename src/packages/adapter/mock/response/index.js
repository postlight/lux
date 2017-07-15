/* @flow */

import Response from '@lux/packages/response'
import { ResponseHeaders } from '../../utils/headers'
import noop from '@lux/utils/noop'
import type Logger from '@lux/packages/logger'

type Options = {
  logger: Logger,
  resolve?: (data: any) => void,
}

export function create(options: Options): Response {
  return new Response({
    stats: [],
    headers: new ResponseHeaders(noop),
    logger: options.logger,
    statusCode: 200,
    statusMessage: 'OK',

    end(body: string): void {
      this.send(body)
    },

    send(body: string): void {
      if (options.resolve) {
        const { headers, statusCode, statusMessage } = this

        options.resolve({
          body,
          headers,
          statusCode,
          statusText: statusMessage,
        })
      }
    },

    status(code: number): Response {
      this.statusCode = code
      return this
    },

    getHeader(key: string): void | string {
      return this.headers.get(key)
    },

    setHeader(key: string, value: string): void {
      this.headers.set(key, value)
    },

    removeHeader(key: string): void {
      this.headers.delete(key)
    },
  })
}
