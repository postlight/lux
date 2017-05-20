/* @flow */

import type { IncomingMessage, ServerResponse } from 'http'

import type { Adapter } from '../index'
import type Application from '../../application'

import * as request from './request'
import * as response from './response'

function createAdapter({ logger }: Application): Adapter {
  function adapter(req: IncomingMessage, res: ServerResponse) {
    return Promise.all([
      request.create(req, logger),
      response.create(res, logger),
    ])
  }

  Object.defineProperty(adapter, 'type', {
    value: 'http',
    writable: false,
    enumerable: true,
    configurable: false,
  })

  return adapter
}

export default createAdapter
export { request, response }
