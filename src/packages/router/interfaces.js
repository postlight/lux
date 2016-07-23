// @flow
import type Controller from '../controller';

export type Router$opts = {
  routes: () => void,
  controllers: Map<string, Controller>
};
