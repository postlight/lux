// @flow
import type Controller from '../../../controller';
import type { Route$type } from '../index';
import type { Method } from '../../../request';
import type { Lux$Collection } from '../../../../interfaces';

export type Params$opts = {
  type: Route$type;
  method: Method;
  controller: Controller;
  dynamicSegments: Array<string>;
};

export type ParameterLike$opts = {
  path: string;
  type?: string;
  values?: Array<any>;
  required?: boolean;
  sanitize?: boolean;
};

export interface ParameterLike extends Lux$Collection<any> {
  path: string;
  type: string;
  required: boolean;
  sanitize: boolean;

  validate<V: any>(value: V): V;
}
