/* @flow */

import type Model from './index';

export type Model$Hook = (instance: Model, trx: Object) => Promise<any>;

export interface Model$Hooks {
  +afterCreate?: Model$Hook;
  +afterDestroy?: Model$Hook;
  +afterSave?: Model$Hook;
  +afterUpdate?: Model$Hook;
  +afterValidation?: Model$Hook;
  +beforeCreate?: Model$Hook;
  +beforeDestroy?: Model$Hook;
  +beforeSave?: Model$Hook;
  +beforeUpdate?: Model$Hook;
  +beforeValidation?: Model$Hook;
}
