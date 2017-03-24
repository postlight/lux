/* @flow */

import type { BuiltInAction } from './index';

export const BUILT_IN_ACTIONS: Array<BuiltInAction> = (
  Object.freeze([
    'show',
    'index',
    'create',
    'update',
    'destroy',
  ])
);
