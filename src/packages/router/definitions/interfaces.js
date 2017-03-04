/* @flow */

import type { Router$Namespace, Resource$opts } from '../index';

export type Router$DefinitionBuilder<T: Router$Namespace> = (
  builder?: () => void,
  namespace: T
) => T;

export type Router$resourceArgs = [string, ?Resource$opts, ?() => void];
