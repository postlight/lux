/* @flow */

import type { Config } from '@lux/packages/config'
import type Database, { Config as DatabaseConfig } from '@lux/packages/database'
import type Controller from '@lux/packages/controller'
import type Serializer from '@lux/packages/serializer'

export type Application$opts = Config & {
  path: string,
  port: string | number,
  database: DatabaseConfig,
}

export type Application$factoryOpts<T: Controller | Serializer<*>> = {
  key: string,
  store: Database,
  parent: ?T,
}
