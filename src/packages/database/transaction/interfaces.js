/* @flow */

import type { Model } from '../index'

// $FlowFixMe
export type Transaction$ResultProxy<+T: Model, U: boolean> = T & {
  didPersist: U,
  unwrap(): T,
}
