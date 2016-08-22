// @flow
import type Controller from '../controller';
import type Serializer from '../serializer';
import type { Model } from '../database';
import type { FreezeableMap } from '../freezeable';

export type Bundle$Models = FreezeableMap<string, Class<Model>>;
export type Bundle$Controllers = FreezeableMap<string, Class<Controller>>;
export type Bundle$Serializers = FreezeableMap<string, Class<Serializer>>;
