/* @flow */

import { camelize } from 'inflection'

import chain from '@lux/utils/chain'
import underscore from '@lux/utils/underscore'
import template from '@lux/packages/template'

/**
 * @private
 */
export default (name: string): string => {
  const normalized = chain(name)
    .pipe(underscore)
    .pipe(str => camelize(str, true))
    .value()

  return template`
    export default function ${normalized}() {

    }
  `
}
