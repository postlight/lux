// @flow
import { cyan } from 'chalk';

import { CWD, PORT } from '../../../constants';
import Logger from '../../logger';
import { createCluster } from '../../pm';

/**
 * @private
 */
export default async function serve(port: number = PORT): Promise<void> {
  let path = CWD;

  if (typeof path !== 'string') {
    path = __dirname;
  }

  const logger = await new Logger({
    path,
    enabled: true
  });

  const cluster = createCluster({
    path,
    port,
    logger
  });

  const { maxWorkers: count } = cluster;

  logger.info(`Starting Lux Server with ${cyan(`${count}`)} worker processes`);

  cluster.once('ready', () => {
    logger.info(`Lux Server listening on port: ${cyan(`${port}`)}`);
  });
}
