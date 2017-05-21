/* @flow */

import type { Adapter } from '../index'
import type Application from '../../application'
import type { ObjectMap } from '../../../interfaces'

import * as request from './request'
import * as response from './response'

type Options = {
  url: string;
  body?: Object;
  method: string;
  headers: ObjectMap<string>;
  resolve?: (data: any) => void;
}

function createAdapter({ logger }: Application): Adapter {
  function adapter({ url, body, method, headers, resolve }: Options) {
    return Promise.resolve([
      request.create({
        url,
        body,
        method,
        logger,
        headers,
      }),
      response.create({
        logger,
        resolve,
      }),
    ])
  }

  Object.defineProperty(adapter, 'type', {
    value: 'mock',
    writable: false,
    enumerable: true,
    configurable: false,
  })

  return adapter
}

export default createAdapter
export { request, response }
