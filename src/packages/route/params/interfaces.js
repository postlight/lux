// @flow
import type Controller from '../../controller';
import type { Request$method } from '../../server';

export type Params$group =
  | string
  | Set<string>
  | Map<string, string | Set<string>>;

export type Params$opts = {
  method: Request$method;
  controller: Controller;
  dynamicSegments: Array<string>;
};
