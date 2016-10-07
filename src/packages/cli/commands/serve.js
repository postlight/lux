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

  if (hot) {
    const watcher = await watch(CWD);

    watcher.on('change', async (changed) => {
      await build(useStrict);
      process.emit('update', changed);
    });
  }

  createCluster({
    logger,
    path: CWD,
    port: PORT,
    maxWorkers: cluster ? undefined : 1
  }).once('ready', () => {
    logger.info(`Lux Server listening on port: ${cyan(`${PORT}`)}`);
  });
}
