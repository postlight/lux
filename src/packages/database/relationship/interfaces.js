// @flow
import type { Model } from '../index';

type Relationship$ref = Model | Array<Model>;

export type Relationship$refs = WeakMap<Model, Map<string, Relationship$ref>>;

export type Relationship$opts = {
  type: 'hasOne' | 'hasMany' | 'belongsTo';
  model: Class<Model>;
  inverse: string;
  through?: string;
  foreignKey: string;
};
