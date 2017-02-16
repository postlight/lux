// @flow
import type { Controller$builtIn } from './index';

export const BUILT_IN_ACTIONS: Array<Controller$builtIn> = (
  Object.freeze([
    'show',
    'index',
    'create',
    'update',
    'destroy',
  ])
);
