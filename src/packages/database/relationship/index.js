// @flow
import { camelize } from 'inflection';

import relatedFor from './utils/related-for';
import { getHasOne, getHasMany, getBelongsTo } from './utils/getters';
import { setHasOne, setHasMany, setBelongsTo } from './utils/setters';

import type { Model } from '../index';

/**
 * @private
 */
export async function get(
  owner: Model,
  key: string
): Promise<Array<Model> | ?Model> {
  const opts = owner.constructor.relationshipFor(key);

  if (!opts) {
    return null;
  }

  const related = relatedFor(owner);
  const { type, model, inverse } = opts;
  let { foreignKey } = opts;
  let value = related.get(key);

  foreignKey = camelize(foreignKey, true);

  if (!value) {
    switch (type) {
      case 'hasOne':
        value = await getHasOne(owner, {
          type,
          model,
          inverse,
          foreignKey
        });
        break;

      case 'hasMany':
        value = await getHasMany(owner, {
          type,
          model,
          inverse,
          foreignKey
        });
        break;

      case 'belongsTo':
        value = await getBelongsTo(owner, {
          type,
          model,
          inverse,
          foreignKey
        });
        break;
    }

    set(owner, key, value);
  }

  return value;
}

/**
 * @private
 */
export function set(owner: Model, key: string, value?: Array<Model> | ?Model) {
  const opts = owner.constructor.relationshipFor(key);

  if (opts) {
    const { type, model, inverse } = opts;
    let { foreignKey } = opts;

    foreignKey = camelize(foreignKey, true);

    if (Array.isArray(value)) {
      if (type === 'hasMany') {
        setHasMany(owner, key, value, {
          type,
          model,
          inverse,
          foreignKey
        });
      }
    } else if (type === 'hasOne') {
      setHasOne(owner, key, value, {
        type,
        model,
        inverse,
        foreignKey
      });
    } else if (type === 'belongsTo') {
      setBelongsTo(owner, key, value, {
        type,
        model,
        inverse,
        foreignKey
      });
    }
  }
}

export { default as saveRelationships } from './utils/save-relationships';

export type { Relationship$opts } from './interfaces';
