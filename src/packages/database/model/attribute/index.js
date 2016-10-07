// @flow
import createGetter from './utils/create-getter';
import createSetter from './utils/create-setter';
import createNormalizer from './utils/create-normalizer';
import type { Attribute$meta } from './interfaces';

/**
 * @private
 */
export function createAttribute(opts: Attribute$meta): Object {
  const normalize = createNormalizer(opts.type);
  const meta = {
    ...opts,
    normalize,
    defaultValue: normalize(opts.defaultValue)
  };

  return {
    get: createGetter(meta),
    set: createSetter(meta)
  };
}

export type { Attribute$meta } from './interfaces';
