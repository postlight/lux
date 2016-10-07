// @flow
import type { Model } from '../../index';
import type { Relationship$opts } from '../index';

import relatedFor from './related-for';
import unassociate from './unassociate';
import validateType from './validate-type';
import { setHasOneInverse, setHasManyInverse } from './inverse-setters';

/**
 * @private
 */
export function setHasMany(owner: Model, key: string, value: Array<Model>, {
  type,
  model,
  inverse,
  foreignKey
}: Relationship$opts) {
  const related = relatedFor(owner);

  if (validateType(model, value)) {
    let prevValue = related.get(key);

    if (Array.isArray(prevValue)) {
      prevValue = unassociate(prevValue, foreignKey);

      if (Array.isArray(prevValue)) {
        prevValue
          .filter(prev => (
            !value.find(next => prev.getPrimaryKey() === next.getPrimaryKey())
          ))
          .forEach(record => owner.prevAssociations.add(record));
      }
    }

    related.set(key, value);

    setHasManyInverse(owner, value, {
      type,
      model,
      inverse,
      foreignKey,
      inverseModel: model
    });
  }
}

/**
 * @private
 */
export function setHasOne(owner: Model, key: string, value?: ?Model, {
  type,
  model,
  inverse,
  foreignKey
}: Relationship$opts) {
  const related = relatedFor(owner);
  let valueToSet = value;

  if (value && typeof value === 'object' && !model.isInstance(value)) {
    valueToSet = Reflect.construct(model, [valueToSet]);
  }

  if (valueToSet) {
    if (validateType(model, valueToSet)) {
      related.set(key, valueToSet);
    }
  } else {
    valueToSet = null;
    related.delete(key);
  }

  setHasOneInverse(owner, valueToSet, {
    type,
    model,
    inverse,
    foreignKey,
    inverseModel: model
  });
}

/**
 * @private
 */
export function setBelongsTo(owner: Model, key: string, value?: ?Model, {
  type,
  model,
  inverse,
  foreignKey
}: Relationship$opts) {
  setHasOne(owner, key, value, {
    type,
    model,
    inverse,
    foreignKey
  });

  if (value) {
    Reflect.set(owner, foreignKey, Reflect.get(value, model.primaryKey));
  } else {
    Reflect.set(owner, foreignKey, null);
  }
}
