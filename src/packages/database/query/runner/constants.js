/* @flow */

import type Query from '../index'

export const RUNNERS: WeakMap<Query<*>, () => Promise<void>> = new WeakMap()
