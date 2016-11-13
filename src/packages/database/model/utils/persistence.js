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
export function create(record: Model, trx: Object): [Object] {
  const timestamp = new Date();

  Reflect.set(record, 'createdAt', timestamp);
  Reflect.set(record, 'updatedAt', timestamp);

  return [
    record.constructor
      .table()
      .transacting(trx)
      .returning(record.constructor.primaryKey)
      .insert(omit(getColumns(record), record.constructor.primaryKey))
  ];
}

/**
 * @private
 */
export function update(record: Model, trx: Object): [Object] {
  Reflect.set(record, 'updatedAt', new Date());

  return [
    record.constructor
      .table()
      .transacting(trx)
      .where(record.constructor.primaryKey, record.getPrimaryKey())
      .update(getColumns(
        record,
        Array.from(record.dirtyAttributes)
      ))
  ];
}

/**
 * @private
 */
export function destroy(record: Model, trx: Object): [Object] {
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
