/* @flow */

import { NODE_ENV } from '@lux/constants'
import { mock, http } from '@lux/packages/adapter'
import * as env from '@lux/utils/env'
import type { AdapterFactory } from '@lux/packages/adapter'
import type { Config as LoggerConfig } from '@lux/packages/logger'
import type { Config as DatabaseConfig } from '@lux/packages/database'

export type Config = {
  adapter: AdapterFactory,
  database: DatabaseConfig,
  logging: LoggerConfig,
  path: string,
  server: {
    cors: {
      enabled: boolean,
    },
  },
}

export const createDefaultConfig = (): Config => ({
  adapter: env.isTest() ? mock : http,
  database: {
    development: {
      driver: 'sqlite3',
    },
    production: {
      driver: 'sqlite3',
    },
    test: {
      driver: 'sqlite3',
    },
  },
  logging: {
    level: env.isProduction() ? 'INFO' : 'DEBUG',
    format: env.isProduction() ? 'json' : 'text',
    enabled: !env.isTest(),
    filter: {
      params: [],
    },
  },
  path: process.cwd(),
  server: {
    cors: {
      enabled: false,
    },
  },
})
