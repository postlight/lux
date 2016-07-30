// @flow
import relatedFor from './related-for';
import unassociate from './unassociate';
import validateType from './validate-type';
import { setHasOneInverse, setHasManyInverse } from './inverse-setters';

import type { Model } from '../../index';
import type { Relationship$opts } from '../index';

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
    const prevValue = unassociate(related.get(key), foreignKey);

    if (prevValue) {
      prevValue
        .filter(prev => !value.find(next => prev.id === next.id))
        .forEach(record => {
          owner.prevAssociations.add(record);
        });
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

  if (value && typeof value === 'object' && !model.isInstance(value)) {
    value = new model(value);
  }

  if (validateType(model, value)) {
    related.set(key, value);

    setHasOneInverse(owner, value, {
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
