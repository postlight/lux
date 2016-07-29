// @flow
import { camelize } from 'inflection';

import relatedFor from './utils/related-for';
import setInverse from './utils/set-inverse';
import validateType from './utils/validate-type';

import type Model from '../model';

/**
 * @private
 */
export async function get(
  owner: Model,
  key: string
): Array<Model> | ?Model {
  const options = owner.constructor.relationshipFor(key);
  let relationship;

  const {
    type,
    model
  } = options;

  if (model) {
    const related = relatedFor(owner);
    let { foreignKey } = options;

    foreignKey = camelize(foreignKey, true);
    relationship = related.get(key);

    if (!relationship) {
      let foreignVal;

      switch (type) {
        case 'hasOne':
        case 'hasMany':
          relationship = model.where({
            [foreignKey]: owner[owner.constructor.primaryKey]
          });

          if (type === 'hasOne') {
            relationship = relationship.first();
          }

          relationship = await relationship;
          break;

        case 'belongsTo':
          foreignVal = owner[foreignKey];

          if (foreignVal) {
            relationship = await model.find(foreignVal);
          }
          break;
      }

      set(owner, key, relationship);
    }
  }

  return relationship;
}

/**
 * @private
 */
export function set(
  owner: Model,
  key: string,
  value: Array<Model> | ?Model
): void {
  const relationship = owner.constructor.relationshipFor(key);
  const { type, model, inverse } = relationship;
  let { foreignKey } = relationship;

  const related = relatedFor(owner);

  foreignKey = camelize(foreignKey, true);

  switch (type) {
    case 'hasMany':
      if (Array.isArray(value) && validateType(model, value)) {
        related.set(key, value);

        setInverse(owner, value, {
          type,
          inverse,
          foreignKey,
          inverseModel: model
        });
      }
      break;

    case 'hasOne':
    case 'belongsTo':
      if (value && typeof value === 'object' && !model.isInstance(value)) {
        value = new model(value);
      }

      if (validateType(model, value)) {
        related.set(key, value);

        setInverse(owner, value, {
          type,
          inverse,
          foreignKey,
          inverseModel: model
        });

        if (type === 'belongsTo') {
          Reflect.set(owner, foreignKey, Reflect.get(value, model.primaryKey));
        }
      }
      break;
  }
}

export { default as saveRelationships } from './utils/save-relationships';
