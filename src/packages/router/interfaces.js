/* @flow */

import type Route from './route'
import type Controller from '@lux/packages/controller'
import type { FreezeableSet } from '@lux/packages/freezeable'

export interface Router$Namespace extends FreezeableSet<Router$NS$content> {
  name: string,
  path: string,
  isRoot: boolean,
  namespace: Router$Namespace,
  controller: Controller,
  controllers: Map<string, Controller>,
}

export type Router$opts = {
  controller: Controller,
  controllers: Map<string, Controller>,
  routes(): void,
}

type Router$NS$content = Route | Router$Namespace
