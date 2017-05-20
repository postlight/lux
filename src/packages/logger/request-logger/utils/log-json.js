/* @flow */

import type Logger from '../../index'
import type Request from '../../../request'
import type Response from '../../../response'

import filterParams from './filter-params'

const MESSAGE = 'Processed Request'

type Options = {
  request: Request;
  response: Response;
};

/**
 * @private
 */
export default function logJSON(logger: Logger, options: Options): void {
  const { request, response } = options
  const { method, headers, url: { path } } = request
  const { statusCode: status } = response
  const userAgent = headers.get('user-agent')
  const protocol = 'HTTP/1.1'

  let { params } = request
  params = filterParams(params, ...logger.filter.params)

  logger.info({
    message: MESSAGE,

    method,
    path,
    params,
    status,
    protocol,
    userAgent,
    remoteAddress: '::1'
  })
}
