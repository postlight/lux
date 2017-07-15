/* @flow */

import { underscore as _ } from 'inflection'

/**
 * @private
 */
export default function underscore(
  source: string = '',
  upper: boolean = false,
): string {
  return _(source, upper).replace(/-/g, '_')
}
