/* @flow */

import type { Environment } from '@lux/types'

export const name = (): Environment => {
  const { env: { NODE_ENV } } = process

  switch (NODE_ENV) {
    case 'production':
    case 'test':
      return NODE_ENV

    default:
      return 'development'
  }
}

export const isDevelopment = (): boolean => name() === 'development'
export const isProduction = (): boolean => name() === 'production'
export const isTest = (): boolean => name() === 'test'
