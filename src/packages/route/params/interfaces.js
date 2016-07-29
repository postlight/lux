// @flow
import type Controller from '../../controller';
import type { Request$method } from '../../server';
import type { Lux$Collection } from '../../../interfaces';

export type Params$opts = {
  action: string;
  method: Request$method;
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
