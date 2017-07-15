/* @flow */

import Cluster from './cluster'
import type { Options } from './cluster'

/**
 * @private
 */
export function createCluster(options: Options) {
  return new Cluster(options)
}
