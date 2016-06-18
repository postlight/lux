// @flow
import type Controller from '../controller';

export type options = {
  path: string;
  action: string;
  method: string;
  controllers: Map<string, Controller>;
};
