/* @flow */

import type Request from '@lux/packages/request'
import type Response from '@lux/packages/response'
import type Logger from '../index'

import logText from './utils/log-text'
import logJSON from './utils/log-json'

export type RequestLogger = (
  req: Request,
  res: Response,
  options: {
    startTime: number,
  },
) => void

/**
 * @private
 */
export function createRequestLogger(logger: Logger): RequestLogger {
  return (req, res, { startTime }) => {
    if (logger.format === 'json') {
      logJSON(logger, {
        startTime,
        request: req,
        response: res,
      })
    } else {
      logText(logger, {
        startTime,
        request: req,
        response: res,
      })
    }
  }
}
