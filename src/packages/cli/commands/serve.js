// @flow
import { cyan } from 'chalk';

import { CWD, PORT, NODE_ENV } from '../../../constants';
import Logger from '../../logger';
import { createLoader } from '../../loader';
import { createCluster } from '../../pm';
import { watch } from '../../fs';

import { build } from './build';

/**
 * @private
 */
export async function serve({
  hot = (NODE_ENV === 'development'),
  cluster = false,
  useStrict = false
}: {
  hot: boolean;
  cluster: boolean;
  useStrict: boolean;
}): Promise<void> {
  const load = createLoader(CWD);
  const { logging } = load('config');
  const logger = new Logger(logging);
  let maxWorkers;

  if (hot) {
    const watcher = await watch(CWD);

    watcher.on('change', async (changed) => {
      await build(useStrict);
      process.emit('update', changed);
    });
  }

  if (!cluster) {
    maxWorkers = 1;
  }

  createCluster({
    logger,
    maxWorkers,
    path: CWD,
    port: PORT
  }).once('ready', () => {
    logger.info(`Lux Server listening on port: ${cyan(`${PORT}`)}`);
  });
}
