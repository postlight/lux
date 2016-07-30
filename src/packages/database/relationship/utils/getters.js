// @flow
import type { Model } from '../../index';
import type { Relationship$opts } from '../index';

/**
 * @private
 */
export function getHasOne(owner: Model, {
  model,
  foreignKey
}: Relationship$opts) {
  return model.first().where({
    [foreignKey]: Reflect.get(owner, owner.constructor.primaryKey)
  });
}

/**
 * @private
 */
export function getHasMany(owner: Model, {
  model,
  foreignKey
}: Relationship$opts) {
  return model.where({
    [foreignKey]: Reflect.get(owner, owner.constructor.primaryKey)
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
