// @flow
import type Serializer from './index';
import type { Model } from '../database';
import type { FreezeableMap } from '../freezeable';

export type Serializer$opts = {
  model: Class<Model>;
  parent: ?Serializer;
  namespace: string;
  serializers: FreezeableMap<string, Serializer>;
};
