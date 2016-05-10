import Logger from '../../logger';
import Database from '../../database';
import loader from '../../loader';

const { env: { PWD } } = process;

export default async function dbSeed() {
  require(`${PWD}/node_modules/babel-core/register`);

  await new Database({
    logger: await Logger.create(),
    config: require(`${PWD}/config/database`).default
  }).define(await loader('models'));

  await require(`${PWD}/db/seed`).default();
}
