/* @flow */

import type Controller from '../../controller';
import type { Router$Namespace } from '../index';

export type Namespace$opts = {
  name: string;
  path: string;
  namespace?: Router$Namespace;
  controller: Controller;
  controllers: Map<string, Controller>;
};
