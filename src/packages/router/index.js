// @flow
import { FreezeableMap } from '../freezeable';
import type { Request } from '../server';

import { ID_PATTERN } from './route';
import Namespace from './namespace';
import { build, define } from './definitions';
import type { Router$opts } from './interfaces';
import type Route from './route'; // eslint-disable-line no-duplicate-imports

/**
 * @private
 */
class Router extends FreezeableMap<string, Route> {
  constructor({ routes, controller, controllers }: Router$opts) {
    super();

    const definitions = build(routes, new Namespace({
      controller,
      controllers,
      path: '/',
      name: 'root'
    }));

    define(this, definitions);

    this.freeze();
  }

  match({ method, url: { pathname } }: Request) {
    const staticPath = pathname.replace(ID_PATTERN, ':dynamic');

    return this.get(`${method}:${staticPath}`);
  }
}

export default Router;

export {
  ID_PATTERN,
  DYNAMIC_PATTERN,
  RESOURCE_PATTERN,
  default as Route
 } from './route';

export type { Router$Namespace } from './interfaces';
export type { Resource$opts } from './resource';
export type { Namespace$opts } from './namespace';
export type { Action, Route$opts, Route$type } from './route';
