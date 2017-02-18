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
  const timestamp = new Date();

  Object.assign(record, {
    createdAt: timestamp,
    updatedAt: timestamp
  });

  Object.assign(record.rawColumnData, {
    createdAt: timestamp,
    updatedAt: timestamp
  });

  const { constructor: { primaryKey } } = record;
  const columns = omit(getColumns(record), primaryKey);

  if (record.dirtyAttributes.has(primaryKey)) {
    columns[primaryKey] = record.getPrimaryKey();
  }

  return [
    record.constructor
      .table()
      .transacting(trx)
      .returning(record.constructor.primaryKey)
      .insert(columns)
  ];
}

/**
 * @private
 */
export function update(record: Model, trx: Object): Array<Object> {
  Reflect.set(record, 'updatedAt', new Date());

  return [
    record.constructor
      .table()
      .transacting(trx)
      .where(record.constructor.primaryKey, record.getPrimaryKey())
      .update(getColumns(record, [
        ...record.dirtyAttributes.keys()
      ]))
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
