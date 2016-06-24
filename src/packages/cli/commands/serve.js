// @flow
import { cyan } from 'chalk';

import { CWD, PORT, NODE_ENV } from '../../../constants';

import Logger from '../../logger';
import Watcher from '../../watcher';
import { createCluster } from '../../pm';

import { build } from './build';

/**
 * @private
 */
export async function serve({
  hot = (NODE_ENV === 'development'),
  useStrict = false
}: {
  hot: boolean,
  useStrict: boolean
}): Promise<void> {
  const logger = await new Logger({
    path: CWD,
    enabled: true
  });

  if (hot) {
    const watcher = await new Watcher(CWD);

    watcher.on('change', async function handleChange(changed) {
      await build(useStrict);
      process.emit('update', changed);
    });
  }

  createCluster({
    logger,
    path: CWD,
    port: PORT
  }).once('ready', () => {
    logger.info(`Lux Server listening on port: ${cyan(`${PORT}`)}`);
  });
}
