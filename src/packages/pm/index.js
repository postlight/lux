// @flow
import Cluster from './cluster';
// eslint-disable-next-line no-duplicate-imports
import type { Options } from './cluster';

/**
 * @private
 */
export function createCluster(options: Options) {
  return new Cluster(options);
}
