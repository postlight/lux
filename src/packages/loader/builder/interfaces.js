/* @flow */

import type { Bundle$Namespace, Bundle$NamespaceGroup } from '../index';

export type Builder$NamespaceMeta<T> = {
  key: string;
  value: Bundle$Namespace<Class<T>>;
  parent: ?T;
};

export type Builder$ParentBuilder<T> = (
  target: Bundle$NamespaceGroup<Class<T>>
) => Array<Builder$NamespaceMeta<T>>;

export type Builder$ChildrenBuilder<T> = (
  target: Array<Builder$NamespaceMeta<T>>
) => Array<Array<[string, T]>>;

export type Builder$Construct<T> = (
  key: string,
  value: Class<T>,
  parent: ?T
) => T;
