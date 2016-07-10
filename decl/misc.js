// @flow
import type { Model } from '../src/packages/database';
import type Controller from '../src/packages/controller';
import type Serializer from '../src/packages/serializer';

type Module = {
  default: Model | Controller | Serializer | Object | Function
};

declare function external(path: string): Module;
