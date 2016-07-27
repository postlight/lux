// @flow
import type { Model } from '../database';
import type Serializer from './index';

export type Serializer$opts = {
  model: Class<Model>;
  serializers: Map<string, Serializer>;
};
