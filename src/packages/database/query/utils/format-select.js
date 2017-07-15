/* @flow */

import { camelize } from '@lux/packages/inflector'

import Model from '../../model'

export default function formatSelect(
  model: Class<Model>,
  attrs?: Array<string> = [],
  prefix?: string = '',
) {
  return attrs.map(attr => {
    const name = model.columnNameFor(attr) || 'undefined'

    return `${model.tableName}.${name} AS ${prefix}${camelize(name)}`
  })
}
