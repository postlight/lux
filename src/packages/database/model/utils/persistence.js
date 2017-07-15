/* @flow */

import { sql } from '@lux/packages/logger'
import omit from '@lux/utils/omit'
import type Logger from '@lux/packages/logger'
import type Model from '../index'

import tableFor from './table-for'
import getColumns from './get-columns'

/**
 * @private
 */
export function create(record: Model, trx: Object): Array<Object> {
  const timestamp = new Date()

  Object.assign(record, {
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  Object.assign(record.rawColumnData, {
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  const { constructor: { primaryKey } } = record
  const columns = omit(getColumns(record), primaryKey)

  if (record.dirtyAttributes.has(primaryKey)) {
    columns[primaryKey] = record.getPrimaryKey()
  }

  return [
    tableFor(record, trx)
      .returning(record.constructor.primaryKey)
      .insert(columns),
  ]
}

/**
 * @private
 */
export function update(record: Model, trx: Object): Array<Object> {
  Reflect.set(record, 'updatedAt', new Date())

  return [
    tableFor(record, trx)
      .where(record.constructor.primaryKey, record.getPrimaryKey())
      .update(getColumns(record, [...record.dirtyAttributes.keys()])),
  ]
}

/**
 * @private
 */
export function destroy(record: Model, trx: Object): Array<Object> {
  return [
    tableFor(record, trx)
      .where(record.constructor.primaryKey, record.getPrimaryKey())
      .del(),
  ]
}

/**
 * @private
 */
export function createRunner(
  logger: Logger,
  statements: Array<Object>,
): (query: Array<Object>) => Promise<Array<Object>> {
  return query => {
    const promises = query.concat(statements)

    promises.forEach(promise => {
      promise.on('query', () => {
        setImmediate(() => {
          logger.debug(sql`${promise.toString()}`)
        })
      })
    })

    return Promise.all(promises)
  }
}
