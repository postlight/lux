/* @flow */

import type { Model } from '../index'

type Type = 'belongsTo' | 'hasMany' | 'hasOne'
type Reference = Model | Array<Model>

export type References = WeakMap<Model, Map<string, Reference>>

export type Relationship = {
  type: Type,
  model: Class<Model>,
  inverse: string,
  through?: Class<Model>,
  foreignKey: string,
}
