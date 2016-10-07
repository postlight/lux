// @flow
import Cluster from './cluster';
import type { Cluster$opts } from './cluster'; // eslint-disable-line max-len, no-duplicate-imports

/**
 * @private
 */
export function createCluster({
  path,
  port,
  logger,
  maxWorkers
}: Cluster$opts) {
  return new Cluster({
    path,
    port,
    logger,
    maxWorkers
  });
}
