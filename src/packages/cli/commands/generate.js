/* @flow */

import { CWD } from '@lux/constants'
import { runGenerator } from '../generator'
import type { Generator$opts } from '../generator' // eslint-disable-line max-len, no-duplicate-imports

/**
 * @private
 */
export function generate({
  cwd = CWD,
  name,
  type,
  attrs = [],
}: Generator$opts): Promise<void> {
  return runGenerator({
    cwd,
    name,
    type,
    attrs,
  })
}
