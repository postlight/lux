/* @flow */

import pick from '@lux/utils/pick'
import type Model from '../index'

/**
 * @private
 */
export default function getColumns(record: Model, only?: Array<string>) {
  let { constructor: { attributes: columns } } = record

  if (only) {
    columns = pick(columns, ...only)
  }

  return Object.entries(columns)
    .map(([key, value]) => {
      if (value && typeof value.columnName === 'string') {
        return [key, value.columnName]
      }

      return [key, 'undefined']
    })
    .reduce(
      (obj, [key, columnName]) => ({
        ...obj,
        [columnName]: Reflect.get(record, key),
      }),
      {},
    )
}
