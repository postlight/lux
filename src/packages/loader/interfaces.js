/* @flow */

import type { FreezeableMap } from '@lux/packages/freezeable'

export type Loader = (type: string) => any
export type Bundle$Namespace<T> = FreezeableMap<string, T>
export type Bundle$NamespaceGroup<T> = FreezeableMap<
  string,
  Bundle$Namespace<T>,
>
