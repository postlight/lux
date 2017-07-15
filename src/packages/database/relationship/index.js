/* @flow */

import { camelize } from 'inflection'

import type { Model } from '../index'

import { getHasOne, getHasMany, getBelongsTo } from './utils/getters'
import { setHasOne, setHasMany, setBelongsTo } from './utils/setters'

/**
 * @private
 */
function set(owner: Model, key: string, value?: Array<Model> | ?Model): void {
  const opts = owner.constructor.relationshipFor(key)

  if (opts) {
    const { type } = opts
    let { foreignKey } = opts

    foreignKey = camelize(foreignKey, true)

    if (Array.isArray(value)) {
      if (type === 'hasMany') {
        setHasMany(owner, key, value, {
          ...opts,
          foreignKey,
        })
      }
    } else if (type === 'hasOne') {
      setHasOne(owner, key, value, {
        ...opts,
        foreignKey,
      })
    } else if (type === 'belongsTo') {
      setBelongsTo(owner, key, value, {
        ...opts,
        foreignKey,
      })
    }
  }
}

/**
 * @private
 */
async function get(owner: Model, key: string): Promise<Array<Model> | ?Model> {
  const opts = owner.constructor.relationshipFor(key)
  let value = null

  if (opts) {
    const { type } = opts
    let { foreignKey } = opts

    value = owner.currentChangeSet.get(key)
    foreignKey = camelize(foreignKey, true)

    if (!value) {
      switch (type) {
        case 'hasOne':
          value = await getHasOne(owner, {
            ...opts,
            foreignKey,
          })
          break

        case 'hasMany':
          value = await getHasMany(owner, {
            ...opts,
            foreignKey,
          })
          break

        default:
          value = await getBelongsTo(owner, {
            ...opts,
            foreignKey,
          })
          break
      }

      set(owner, key, value)
    }
  }

  return value
}

export { get, set }
export { default as updateRelationship } from './utils/update-relationship'
export type { Relationship } from './interfaces'
