// @flow
import type { Attribute$meta } from '../index';

import createGetter from './create-getter';
import createSetter from './create-setter';
import createNormalizer from './create-normalizer';

/**
 * @private
 */
export default function createAttribute(opts: Attribute$meta): Object {
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
