/* @flow */

import { extname } from 'path'

/**
 * @private
 */
export default function isJSFile(target: string): boolean {
  return extname(target) === '.js'
}
