/* @flow */

import { NODE_ENV } from '@lux/constants'

const isTestENV = NODE_ENV === 'test'
const isProdENV = NODE_ENV === 'production'

export const CREATE_DEFAULT_CONFIG_RESULT = {
  server: {
    cors: {
      enabled: false,
    },
  },
  logging: {
    level: isProdENV ? 'INFO' : 'DEBUG',
    format: isProdENV ? 'json' : 'text',
    enabled: !isTestENV,

    filter: {
      params: [],
    },
  },
}
