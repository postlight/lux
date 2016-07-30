// @flow
import setType from '../../../../utils/set-type';
import relatedFor from './related-for';

import type { Model } from '../../index';
import type { Relationship$opts } from '../index';

/**
 * @private
 */
export function setHasManyInverse(owner: Model, value: Array<Model>, {
  inverse,
  foreignKey,
  inverseModel
}: Relationship$opts & {
  inverseModel: Class<Model>;
}) {
  const primaryKey = Reflect.get(owner, owner.constructor.primaryKey);
  const { type: inverseType } = inverseModel.relationshipFor(inverse);

  for (const record of value) {
    const related = relatedFor(record);

    if (owner !== related.get(inverse)) {
      relatedFor(record).set(inverse, owner);

      if (inverseType === 'belongsTo') {
        Reflect.set(record, foreignKey, primaryKey);
      }
    }
  }
}

/**
 * @private
 */
export function setHasOneInverse(owner: Model, value?: ?Model, {
  inverse,
  foreignKey,
  inverseModel
}: Relationship$opts & {
  inverseModel: Class<Model>;
}) {
  if (value) {
    const { type: inverseType } = inverseModel.relationshipFor(inverse);
    const related = relatedFor(value);
    let inverseValue = related.get(inverse);

    if (inverseType === 'hasMany') {
      if (!Array.isArray(inverseValue)) {
        inverseValue = setType(() => []);
      }

      if (!inverseValue.includes(owner)) {
        inverseValue.push(owner);
      }
    } else {
      if (owner !== inverseValue) {
        const primaryKey = Reflect.get(owner, owner.constructor.primaryKey);

        inverseValue = owner;

        if (inverseType === 'belongsTo') {
          Reflect.set(value, foreignKey, primaryKey);
        }
      }
    }

    if (inverseValue) {
      related.set(inverse, inverseValue);
    } else {
      related.delete(inverse);
    }
  }
}
