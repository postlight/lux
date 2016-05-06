import Logger from '../../logger';
import Database from '../../database';

const { env: { PWD } } = process;

export default async function migrate() {
  require(`${PWD}/node_modules/babel-core/register`);

  return await new Database({
    logger: await Logger.create(),
    config: require(`${PWD}/config/database.json`)
  }).rollback();
}
