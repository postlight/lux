// @flow
import { BUILT_IN_ACTIONS } from '../../../../controller';

import type { Resource$opts } from '../../../index';

/**
 * @private
 */
export default function normalizeResourceArgs(args: [
  string,
  ?{ path: Resource$opts.path, only: Resource$opts.only },
  Function
]): [{
  name: Resource$opts.name,
  path: Resource$opts.path,
  only: Resource$opts.only
}, Function] {
  const [name] = args;
  let [, opts, builder] = args;

  if (!opts) {
    opts = {};
  }

  if (typeof opts === 'function') {
    builder = opts;
    opts = {};
  }

  if (typeof builder !== 'function') {
    builder = () => void 0;
  }

  opts = {
    ...opts,
    name
  };

  if (!opts.path) {
    opts = {
      ...opts,
      path: `/${name}`
    };
  }

  if (!opts.only) {
    opts = {
      ...opts,
      only: [...BUILT_IN_ACTIONS]
    };
  }

  return [opts, builder];
}
