// @flow
import type Controller from '../controller';

export type Router$opts = {
  controllers: Map<string, Controller>;

  routes(): void;
};
