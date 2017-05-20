/* @flow */

import { BUILT_IN_ACTIONS } from '../../../../controller'
// eslint-disable-next-line no-duplicate-imports
import type { BuiltInAction } from '../../../../controller'

/**
 * @private
 */
export default function normalizeResourceArgs(args: Array<any>): [{
  name: string,
  path: string,
  only: Array<BuiltInAction>
}, Function] {
  const [name] = args
  let [, opts, builder] = args

  if (!opts) {
    opts = {
      path: '',
      only: undefined
    }
  }

  if (typeof opts === 'function') {
    builder = opts
    opts = {
      path: '',
      only: undefined
    }
  }

  if (typeof builder !== 'function') {
    builder = () => undefined
  }

  opts = {
    ...opts,
    name
  }

  if (!opts.path) {
    opts = {
      ...opts,
      path: `/${name}`
    }
  }

  if (!opts.only) {
    opts = {
      ...opts,
      only: [...BUILT_IN_ACTIONS]
    }
  }

  return [opts, builder]
}
