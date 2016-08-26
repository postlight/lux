import { CWD } from '../../../constants';

import Logger from '../../logger';
import Database from '../../database';
import { createLoader } from '../../loader';

/**
 * @private
 */
export async function dbseed() {
  const load = createLoader(CWD);

  const { database: config } = load('config');
  const seed = load('seed');
  const models = load('models');

  await new Database({
    config,
    models,
    path: CWD,

    logger: new Logger({
      enabled: false
    })
  });

  await seed();
}
