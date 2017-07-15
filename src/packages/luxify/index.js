/* @flow */

import type { Action } from '@lux/packages/router'
import type Request from '@lux/packages/request'
import type Response from '@lux/packages/response'

import createResponseProxy from './utils/create-response-proxy'

/**
 * Convert traditional node HTTP server middleware into a lux compatible
 * function for use in Controller#beforeAction.
 *
 * @module lux-framework
 * @namespace Lux
 * @function luxify
 */
export default function luxify(
  middleware: (
    req: Request,
    res: Response,
    next: (err?: Error) => void,
  ) => void,
): Action<any> {
  const result = (req, res) =>
    new Promise((resolve, reject) => {
      middleware.apply(null, [
        req,
        createResponseProxy(res, resolve),
        err => {
          if (err && err instanceof Error) {
            reject(err)
          } else {
            resolve()
          }
        },
      ])
    })

  return Object.defineProperty(result, 'name', {
    value: middleware.name,
  })
}
