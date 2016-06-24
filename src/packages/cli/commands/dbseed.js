import { CWD } from '../../../constants';
import Logger from '../../logger';
import Database from '../../database';
import loader from '../../loader';

/**
 * @private
 */
export async function dbseed() {
  const { database: config } = loader(CWD, 'config');
  const seed = loader(CWD, 'seed');
  const models = loader(CWD, 'models');

  await new Database({
    config,
    models,
    path: CWD,

    logger: await new Logger({
      path: CWD,
      enabled: false
    })
  });

  await seed();
}
