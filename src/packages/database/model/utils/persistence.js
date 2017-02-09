// @flow
import { sql } from '../../../logger';
import omit from '../../../../utils/omit';
// eslint-disable-next-line no-duplicate-imports
import type Logger from '../../../logger';
import type Model from '../index';

import getColumns from './get-columns';

/**
 * @private
 */
export function create(record: Model, trx: Object): Array<Object> {
  const target = record;
  const timestamp = new Date();

  Object.assign(target, {
    createdAt: timestamp,
    updatedAt: timestamp
  });

  Object.assign(target.rawColumnData, {
    createdAt: timestamp,
    updatedAt: timestamp
  });

  return [
    target.constructor
      .table()
      .transacting(trx)
      .returning(target.constructor.primaryKey)
      .insert(omit(getColumns(target), target.constructor.primaryKey))
  ];
}

/**
 * @private
 */
export function update(record: Model, trx: Object): Array<Object> {
  const target = record;

  target.updatedAt = new Date();

  return [
    target.constructor
      .table()
      .transacting(trx)
      .where(target.constructor.primaryKey, target.getPrimaryKey())
      .update(getColumns(
        target,
        Array.from(target.dirtyAttributes.keys())
      ))
  ];
}

/**
 * @private
 */
export function destroy(record: Model, trx: Object): Array<Object> {
  return [
    record.constructor
      .table()
      .transacting(trx)
      .where(record.constructor.primaryKey, record.getPrimaryKey())
      .del()
  ];
}

/**
 * @private
 */
export function createRunner(
  logger: Logger,
  statements: Array<Object>
): (query: Array<Object>) => Promise<Array<Object>> {
  return query => {
    const promises = query.concat(statements);

    promises.forEach(promise => {
      promise.on('query', () => {
        setImmediate(() => {
          logger.debug(sql`${promise.toString()}`);
        });
      });
    });

    return Promise.all(promises);
  };
}
