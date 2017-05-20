/* @flow */

import { EOL } from 'os'

import { classify, camelize } from 'inflection'

import template from '../../template'
import indent from '../utils/indent'
import chain from '../../../utils/chain'
import entries from '../../../utils/entries'
import underscore from '../../../utils/underscore'

const VALID_ATTR = /^(\w|-)+:(\w|-)+$/
const RELATIONSHIP = /^belongs-to|has-(one|many)$/

/**
 * @private
 */
export default (name: string, attrs: Array<string>) => {
  const normalized = chain(name)
    .pipe(underscore)
    .pipe(classify)
    .value()

  return template`
    import { Model } from 'lux-framework';

    class ${normalized} extends Model {
    ${entries((attrs || [])
      .filter(attr => VALID_ATTR.test(attr))
      .map(attr => attr.split(':'))
      .filter(([, type]) => RELATIONSHIP.test(type))
      .reduce((types, [related, type]) => {
        const key = chain(type)
          .pipe(underscore)
          .pipe(str => camelize(str, true))
          .value()

        const value = Reflect.get(types, key)

        if (value) {
          const inverse = camelize(normalized, true)
          const relatedKey = chain(related)
            .pipe(underscore)
            .pipe(str => camelize(str, true))
            .value()

          return {
            ...types,
            [key]: [
              ...value,
              `${indent(8)}${relatedKey}: {${EOL}`
              + `${indent(10)}inverse: '${inverse}'${EOL}`
              + `${indent(8)}}`
            ]
          }
        }

        return types
      }, {
        hasOne: [],
        hasMany: [],
        belongsTo: []
      }))
      .filter(([, value]) => value.length)
      .reduce((result, [key, value], index) => (
        chain(result)
          .pipe(str => {
            if (index && str.length) {
              return `${str}${EOL.repeat(2)}`
            }

            return str
          })
          .pipe(str => (
            str // eslint-disable-line prefer-template
            + `${indent(index === 0 ? 2 : 6)}static ${key} = {${EOL}`
            + `${value.join(`,${EOL.repeat(2)}`)}${EOL}` // eslint-disable-line max-len, comma-spacing
            + `${indent(6)}};`
          ))
          .value()
      ), '')}
    }

    export default ${normalized};
  `
}
