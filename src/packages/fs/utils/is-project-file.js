/* @flow */

import { extname, basename } from 'path'

/**
 * @private
 */
export default function isProjectFile(target: string): boolean {
  return extname(target) === '.js' && basename(target).split('.').length <= 2
}
