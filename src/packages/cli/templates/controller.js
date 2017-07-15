/* @flow */

import { pluralize } from 'inflection'

import template from '@lux/packages/template'
import { classify, camelize } from '@lux/packages/inflector'

import indent from '../utils/indent'

const parseAttrs = attrs =>
  attrs
    .filter(attr => /^(\w|-)+:(\w|-)+$/g.test(attr))
    .map(attr => attr.split(':')[0])
    .map(camelize)

/**
 * @private
 */
export default (name: string, attrs: Array<string>): string => {
  let normalized = classify(name)

  if (!normalized.endsWith('Application')) {
    normalized = pluralize(normalized)
  }

  const body = Object.entries(
    parseAttrs(attrs),
  ).reduce((result, group, index) => {
    const [key] = group
    let [, value] = group
    let str = result

    if (Array.isArray(value) && value.length) {
      value = value.join(',\n')

      if (index && str.length) {
        str += '\n\n'
      }

      str +=
        `${indent(index === 0 ? 2 : 6)}${key} = ` +
        `[\n${value}\n${indent(6)}];`
    }

    return str
  }, '')

  return template`
    import { Controller } from 'lux-framework';

    class ${normalized}Controller extends Controller {
    ${body}
    }

    export default ${normalized}Controller;
  `
}
