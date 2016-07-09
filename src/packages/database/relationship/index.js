// @flow
import { camelize } from 'inflection';

import relatedFor from './utils/related-for';

import type Model from '../model';

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

export function set(
  owner: Model,
  key: string,
  val: Array<Model> | ?Model
): void {
  const { type, model } = owner.constructor.relationshipFor(key);
  const related = relatedFor(owner);

  switch (type) {
    case 'hasMany':
      if (Array.isArray(val)) {
        related.set(key, val);
      }
      break;

    case 'hasOne':
    case 'belongsTo':
      if (val && typeof val === 'object' && !model.isInstance(val)) {
        val = new model(val);
      }

      related.set(key, val);
      break;
  }
}
