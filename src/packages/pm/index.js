// @flow
import Cluster from './cluster';

import type Logger from '../logger';

/**
 * @private
 */
export function createCluster({
  path,
  port,
  logger,
  maxWorkers
}: {
  path: string;
  port: number;
  logger: Logger;
  maxWorkers?: number;
}) {
  return new Cluster({
    path,
    port,
    logger,
    maxWorkers
  });
}
