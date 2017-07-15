/* @flow */

import type Controller from '@lux/packages/controller'
import type { Method } from '@lux/packages/request'

export type Route$type = 'custom' | 'member' | 'collection'

export type Route$opts = {
  type: Route$type,
  path: string,
  action: string,
  method: Method,
  controller: Controller,
}
