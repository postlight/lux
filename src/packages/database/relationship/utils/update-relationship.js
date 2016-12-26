// @flow
import type { Model } from '../../index';
import type { Relationship$opts } from '../interfaces';

type Params = {
  record: Model;
  value: ?Model | Array<Model>;
  opts: Relationship$opts;
  trx: Object;
};

function updateHasOne({
  record,
  value,
  opts,
  trx
}: Params): Array<Object> {
  const recordPrimaryKey = record.getPrimaryKey();

  if (value) {
    if (value instanceof opts.model) {
      return [
        opts.model
          .table()
          .transacting(trx)
          .update(opts.foreignKey, null)
          .where(
            `${opts.model.tableName}.${opts.foreignKey}`,
            recordPrimaryKey
          )
          .whereNot(
            `${opts.model.tableName}.${opts.model.primaryKey}`,
            value.getPrimaryKey()
          ),
        opts.model
          .table()
          .transacting(trx)
          .update(opts.foreignKey, recordPrimaryKey)
          .where(
            `${opts.model.tableName}.${opts.model.primaryKey}`,
            value.getPrimaryKey()
          )
      ];
    }
  } else {
    return [
      opts.model
        .table()
        .transacting(trx)
        .update(opts.foreignKey, null)
        .where(
          `${opts.model.tableName}.${opts.foreignKey}`,
          recordPrimaryKey
        )
    ];
  }

  return [];
}

function updateHasMany({
  record,
  value,
  opts,
  trx
}: Params): Array<Object> {
  const recordPrimaryKey = record.getPrimaryKey();

  if (Array.isArray(value) && value.length) {
    return [
      opts.model
        .table()
        .transacting(trx)
        .update(opts.foreignKey, null)
        .where(
          `${opts.model.tableName}.${opts.foreignKey}`,
          recordPrimaryKey
        )
        .whereNotIn(
          `${opts.model.tableName}.${opts.model.primaryKey}`,
          value.map(item => item.getPrimaryKey())
        ),
      opts.model
        .table()
        .transacting(trx)
        .update(opts.foreignKey, recordPrimaryKey)
        .whereIn(
          `${opts.model.tableName}.${opts.model.primaryKey}`,
          value.map(item => item.getPrimaryKey())
        )
    ];
  }

  return [
    opts.model
      .table()
      .transacting(trx)
      .update(opts.foreignKey, null)
      .where(
        `${opts.model.tableName}.${opts.foreignKey}`,
        recordPrimaryKey
      )
  ];
}

function updateBelongsTo({
  record,
  value,
  opts,
  trx
}: Params): Array<Object> {
  if (value instanceof opts.model) {
    const inverseOpts = opts.model.relationshipFor(opts.inverse);
    const foreignKeyValue = value.getPrimaryKey();

    Reflect.set(record, opts.foreignKey, foreignKeyValue);

    if (inverseOpts && inverseOpts.type === 'hasOne') {
      return [
        record.constructor
          .table()
          .transacting(trx)
          .update(opts.foreignKey, null)
          .where(opts.foreignKey, foreignKeyValue)
          .whereNot(
            `${record.constructor.tableName}.${record.constructor.primaryKey}`,
            record.getPrimaryKey()
          )
      ];
    }
  }

  return [];
}

/**
 * @private
 */
export default function updateRelationship(
  record: Model,
  name: string,
  trx: Object
): Array<Object> {
  const opts = record.constructor.relationshipFor(name);

  if (!opts) {
    const {
      constructor: {
        name: className
      }
    } = record;

    throw new Error(`Could not find relationship '${name} on '${className}`);
  }

  const { dirtyRelationships } = record;

  if (!dirtyRelationships.has(name)) {
    return [];
  }

  const value = dirtyRelationships.get(name);

  switch (opts.type) {
    case 'hasOne':
      return updateHasOne({
        record,
        value,
        opts,
        trx
      });

    case 'hasMany':
      return updateHasMany({
        record,
        value,
        opts,
        trx
      });

    default:
      return updateBelongsTo({
        record,
        value,
        opts,
        trx
      });
  }
}
