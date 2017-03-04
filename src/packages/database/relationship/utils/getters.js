/* @flow */

import { camelize } from 'inflection';

import type { Model } from '../../index';
import type { Relationship$opts } from '../index';

/**
 * @private
 */
async function getHasManyThrough(owner: Model, {
  model,
  inverse,
  through,
  foreignKey: baseKey
}: Relationship$opts): Promise<Array<Model>> {
  const inverseOpts = model.relationshipFor(inverse);
  let value = [];

  if (through && inverseOpts) {
    const foreignKey = camelize(inverseOpts.foreignKey, true);
    const records = await through
      .select(baseKey, foreignKey)
      .where({
        [baseKey]: owner.getPrimaryKey()
      });

    if (records.length) {
      value = await model.where({
        [model.primaryKey]: records
          .map(record => Reflect.get(record, foreignKey))
          .filter(Boolean)
      });
    }
  }

  return value;
}

/**
 * @private
 */
export function getHasOne(owner: Model, {
  model,
  foreignKey
}: Relationship$opts) {
  return model.first().where({
    [foreignKey]: owner.getPrimaryKey()
  });
}

/**
 * @private
 */
export function getHasMany(owner: Model, opts: Relationship$opts) {
  const { model, through, foreignKey } = opts;

  return through ? getHasManyThrough(owner, opts) : model.where({
    [foreignKey]: owner.getPrimaryKey()
  });
}

/**
 * @private
 */
export function getBelongsTo(owner: Model, {
  model,
  foreignKey
}: Relationship$opts) {
  const foreignValue = Reflect.get(owner, foreignKey);

  return foreignValue ? model.find(foreignValue) : Promise.resolve(null);
}
