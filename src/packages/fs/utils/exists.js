/* @flow */

import { stat, readdir } from '../index'

/**
 * @private
 */
async function exists(path: string | RegExp, dir?: string): Promise<boolean> {
  if (path instanceof RegExp) {
    const pattern = path
    let files = []

    if (dir) {
      files = await readdir(dir)
    }

    return files.some(file => pattern.test(file))
  }

  return stat(path).then(
    () => true,
    () => false
  )
}

export default exists
