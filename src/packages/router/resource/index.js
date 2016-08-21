// @flow
import Namespace from '../namespace';

import normalizeOnly from './utils/normalize-only';

import type { Controller$builtIn } from '../../controller';
import type { Resource$opts } from './interfaces';

/**
 * @private
 */
class Resource extends Namespace {
  only: Set<Controller$builtIn>;

  constructor({ only, ...opts }: Resource$opts) {
    super(opts);

    Reflect.defineProperty(this, 'only', {
      value: new Set(normalizeOnly(only)),
      writable: false,
      enumerable: false,
      configurable: false
    });
  }
}

export default Resource;

export type { Resource$opts } from './interfaces';
