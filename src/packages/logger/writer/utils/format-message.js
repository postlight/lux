/* @flow */

import { ANSI } from '../constants'
import stringify from '../../../../utils/stringify'
import type { Format } from '../../index'

export default function formatMessage(data?: ?mixed, format: Format): string {
  if (data instanceof Error) {
    return data.stack
  } else if (format === 'json') {
    return stringify(data).replace(ANSI, '')
  }

  return stringify(data, 2)
}
