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
  let value = null;

  if (opts) {
    const related = relatedFor(owner);
    const { type } = opts;
    let { foreignKey } = opts;

    value = related.get(key);
    foreignKey = camelize(foreignKey, true);

    if (!value) {
      switch (type) {
        case 'hasOne':
          value = await getHasOne(owner, {
            ...opts,
            foreignKey
          });
          break;

        case 'hasMany':
          value = await getHasMany(owner, {
            ...opts,
            foreignKey
          });
          break;

        case 'belongsTo':
          value = await getBelongsTo(owner, {
            ...opts,
            foreignKey
          });
          break;
      }

      set(owner, key, value);
    }
  }

  return value;
}

/**
 * @private
 */
export function set(owner: Model, key: string, value?: Array<Model> | ?Model) {
  const opts = owner.constructor.relationshipFor(key);

  if (opts) {
    const { type } = opts;
    let { foreignKey } = opts;

    foreignKey = camelize(foreignKey, true);

    if (Array.isArray(value)) {
      if (type === 'hasMany') {
        setHasMany(owner, key, value, {
          ...opts,
          foreignKey
        });
      }
    } else if (type === 'hasOne') {
      setHasOne(owner, key, value, {
        ...opts,
        foreignKey
      });
    } else if (type === 'belongsTo') {
      setBelongsTo(owner, key, value, {
        ...opts,
        foreignKey
      });
    }
  }
}

export { default as saveRelationships } from './utils/save-relationships';

export type { Relationship$opts } from './interfaces';
