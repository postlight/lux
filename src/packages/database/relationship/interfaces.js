// @flow
import type { Model } from '../index';

type Relationship$ref = void | ?Model | Array<Model>;

export type Relationship$refs = WeakMap<Model, Map<string, Relationship$ref>>;

export type Relationship$opts = {
  type: 'hasOne' | 'hasMany' | 'belongsTo';
  model: Class<Model>;
  inverse: string;
  foreignKey: string;
};
