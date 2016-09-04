// @flow
import type Serializer from './index';
import type { Model } from '../database';

export type Serializer$opts<T: Model> = {
  model: Class<T>;
  parent: ?Serializer<*>;
  namespace: string;
};
