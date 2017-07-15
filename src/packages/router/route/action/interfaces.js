/* @flow */

import type Request from '@lux/packages/request'
import type Response from '@lux/packages/response'

export type Action<T> = (
  request: Request,
  response: Response,
  data?: T,
) => Promise<T>
