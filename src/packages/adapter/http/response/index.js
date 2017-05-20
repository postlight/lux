/* @flow */

import type { ServerResponse } from 'http'

import Response from '../../../response'
import { ResponseHeaders } from '../../utils/headers'
import type Logger from '../../../logger'

export function create(res: ServerResponse, logger: Logger): Response {
  return new Response({
    logger,
    stats: [],
    headers: new ResponseHeaders((type, [key, value]) => {
      if (type === 'SET' && value) {
        res.setHeader(key, value)
      } else if (type === 'DELETE') {
        res.removeHeader(key)
      }
    }),
    statusCode: 200,
    statusMessage: 'OK',

    end(body: string): void {
      res.end(body)
    },

    send(body: string): void {
      this.end(body)
    },

    status(code: number): Response {
      res.statusCode = code // eslint-disable-line no-param-reassign
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
