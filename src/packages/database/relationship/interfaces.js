// @flow
import type Model from '../model';

export type options = {
  type: 'hasOne' | 'hasMany' | 'belongsTo';
  model: Model;
  inverse: string;
  foreignKey: string;
};
