// @flow
import type { Method } from './index';

export const HAS_BODY: RegExp = /^(?:POST|PATCH)$/i;
export const METHODS: Set<Method> = (
  new Set([
    'GET',
    'HEAD',
    'POST',
    'PATCH',
    'DELETE',
    'OPTIONS',
  ])
);
