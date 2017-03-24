/* @flow */

import Namespace from '../namespace';
import { FreezeableSet } from '../../freezeable';
import type { BuiltInAction } from '../../controller';

import normalizeOnly from './utils/normalize-only';
import type { Resource$opts } from './interfaces';

/**
 * @private
 */
class Resource extends Namespace {
  only: FreezeableSet<BuiltInAction>;

  constructor({ only, ...opts }: Resource$opts) {
    super(opts);

    Reflect.defineProperty(this, 'only', {
      value: new FreezeableSet(normalizeOnly(only)),
      writable: false,
      enumerable: false,
      configurable: false
    });

    this.only.freeze();
  }
}

export default Resource;

export type { Resource$opts } from './interfaces';
