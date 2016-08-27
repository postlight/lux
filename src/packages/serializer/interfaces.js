// @flow
import type Serializer from './index';
import type { Model } from '../database';

export type Serializer$opts = {
  model: Class<Model>;
  parent: ?Serializer;
  namespace: string;
};
