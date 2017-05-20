/* @flow */

import { MIME_TYPE } from '../constants'

/**
 * @private
 */
export default function isJSONAPI(value: string): boolean {
  return value.startsWith(MIME_TYPE)
}
