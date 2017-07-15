/* @flow */

import { BUILT_IN_ACTIONS } from '@lux/packages/controller'
import type { BuiltInAction } from '@lux/packages/controller'

/**
 * @private
 */
export default function normalizeResourceArgs(
  args: Array<any>,
): [
  {
    name: string,
    path: string,
    only: Array<BuiltInAction>,
  },
  Function,
] {
  const [name] = args
  let [, opts, builder] = args

  if (!opts) {
    opts = {
      path: '',
      only: undefined,
    }
  }

  if (typeof opts === 'function') {
    builder = opts
    opts = {
      path: '',
      only: undefined,
    }
  }

  if (typeof builder !== 'function') {
    builder = () => undefined
  }

  opts = {
    ...opts,
    name,
  }

  if (!opts.path) {
    opts = {
      ...opts,
      path: `/${name}`,
    }
  }

  if (!opts.only) {
    opts = {
      ...opts,
      only: [...BUILT_IN_ACTIONS],
    }
  }

  return [opts, builder]
}
