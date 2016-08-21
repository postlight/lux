// @flow
import { FreezeableSet } from '../../freezeable';

import normalizeName from './utils/normalize-name';
import normalizePath from './utils/normalize-path';

import type { Route, Router$Namespace } from '../index';
import type { Namespace$opts } from './interfaces';

/**
 * @private
 */
class Namespace extends FreezeableSet<Route | Router$Namespace> {
  name: Router$Namespace.name;

  path: Router$Namespace.path;

  isRoot: Router$Namespace.isRoot;

  namespace: Router$Namespace;

  controller: Router$Namespace.controller;

  controllers: Router$Namespace.controllers;

  constructor({
    name,
    path,
    namespace,
    controller,
    controllers
  }: Namespace$opts) {
    super();

    Object.defineProperties(this, {
      name: {
        value: normalizeName(name),
        writable: false,
        enumerable: true,
        configurable: false
      },

      path: {
        value: normalizePath(path),
        writable: false,
        enumerable: true,
        configurable: false
      },

      namespace: {
        value: namespace || this,
        writable: false,
        enumerable: true,
        configurable: false
      },

      controller: {
        value: controller,
        writable: false,
        enumerable: true,
        configurable: false
      },

      isRoot: {
        value: path === '/',
        writable: false,
        enumerable: false,
        configurable: false
      },

      controllers: {
        value: controllers,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });
  }
}

export default Namespace;

export { default as normalizeName } from './utils/normalize-name';
export { default as normalizePath } from './utils/normalize-path';

export type { Namespace$opts } from './interfaces';
