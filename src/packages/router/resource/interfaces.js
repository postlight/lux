/* @flow */

import type { BuiltInAction } from '@lux/packages/controller'
import type { Namespace$opts } from '../namespace'

export type Resource$opts = Namespace$opts & {
  only: Array<BuiltInAction>,
}
