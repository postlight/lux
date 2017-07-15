/* @flow */

import { parse as parseURL } from 'url'
import type { IncomingMessage } from 'http'

import qs from 'qs'

import { HAS_BODY } from '@lux/constants'
import Request from '@lux/packages/request'
import type Logger from '@lux/packages/logger'
import * as query from '../../utils/query'
import * as method from '../../utils/method'
import { Headers } from '../../utils/headers'

export function create(req: IncomingMessage, logger: Logger): Promise<Request> {
  return new Promise((resolve, reject) => {
    const url = parseURL(req.url)
    const headers = new Headers(req.headers)
    const request = new Request({
      logger,
      headers,
      url: { ...url, params: [] },
      params: query.fromObject(qs.parse(url.query)),
      method: method.resolve(req.method, headers),
      // $FlowFixMe
      encrypted: Boolean(req.connection.encrypted),
      defaultParams: {},
    })

    headers.freeze()

    if (HAS_BODY.test(request.method)) {
      let offset = 0
      const body = Buffer.allocUnsafe(
        Number.parseInt(request.headers.get('content-length') || '0', 10) || 0,
      )

      req
        .on('data', (data: Buffer) => {
          data.copy(body, offset)
          offset += data.length
        })
        .once('end', () => {
          req.removeAllListeners('end')
          req.removeAllListeners('data')
          req.removeAllListeners('error')

          request.params.data = JSON.parse(body.toString())

          resolve(request)
        })
        .once('error', (err: Error) => {
          req.removeAllListeners('end')
          req.removeAllListeners('data')
          req.removeAllListeners('error')

          reject(err)
        })
    } else {
      resolve(request)
    }
  })
}
