// @flow
import type { Model } from '../../index';
import type { Relationship$opts } from '../index';

type Setter$opts = {
  type: $PropertyType<Relationship$opts, 'type'>;
  model: $PropertyType<Relationship$opts, 'model'>;
  inverse: $PropertyType<Relationship$opts, 'inverse'>;
  through?: $PropertyType<Relationship$opts, 'through'>;
  foreignKey: $PropertyType<Relationship$opts, 'foreignKey'>;
  inverseModel: Class<Model>;
};

/**
 * @private
 */
export function setHasManyInverse(owner: Model, value: Array<Model>, {
  inverse,
  foreignKey,
  inverseModel
}: Setter$opts) {
  // $FlowIgnore
  const primaryKey = owner[owner.constructor.primaryKey];
  const relationship = inverseModel.relationshipFor(inverse);

  if (!relationship) {
    return;
  }

  const { type: inverseType } = relationship;

  for (const record of value) {
    let { currentChangeSet: changeSet } = record;

    if (owner !== changeSet.get(inverse)) {
      if (changeSet.isPersisted) {
        changeSet = changeSet.applyTo(record);
      }

      changeSet.set(inverse, owner);

      if (inverseType === 'belongsTo') {
        // $FlowIgnore
        record[foreignKey] = primaryKey;
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
}: Setter$opts) {
  if (value) {
    const nextValue = value;
    const relationship = inverseModel.relationshipFor(inverse);

    if (!relationship) {
      return;
    }

    const { type: inverseType } = relationship;
    let inverseValue = value.currentChangeSet.get(inverse);

    if (inverseType === 'hasMany') {
      if (!Array.isArray(inverseValue)) {
        inverseValue = [];
      }

      if (!inverseValue.includes(owner)) {
        inverseValue.push(owner);
      }
    } else if (owner !== inverseValue) {
      inverseValue = owner;

      if (inverseType === 'belongsTo') {
        // $FlowIgnore
        nextValue[foreignKey] = inverseValue.getPrimaryKey();
      }
    }

    let { currentChangeSet: changeSet } = nextValue;

    if (changeSet.isPersisted) {
      changeSet = changeSet.applyTo(nextValue);
    }

    changeSet.set(inverse, inverseValue || null);
  }
}
