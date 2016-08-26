// @flow
import type Controller from '../controller';
import type Serializer from '../serializer';
import type { Model } from '../database';
import type { FreezeableMap } from '../freezeable';

export type Loader = (type: string) => any;
export type Bundle$Namespace<T> = FreezeableMap<string, T>;
export type Bundle$NamespaceGroup<T> = FreezeableMap<
  string,
  Bundle$Namespace<T>
>;
