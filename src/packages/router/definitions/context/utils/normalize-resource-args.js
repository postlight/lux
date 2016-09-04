// @flow
import { BUILT_IN_ACTIONS } from '../../../../controller';

import type { Controller$builtIn } from '../../../../controller';

/**
 * @private
 */
export default function normalizeResourceArgs(args: [
  string,
  ?{ path: string, only: Array<Controller$builtIn> },
  Function
]): [{
  name: string,
  path: string,
  only: Array<Controller$builtIn>
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
