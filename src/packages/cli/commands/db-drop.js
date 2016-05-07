import { connect } from '../../database';

const { env: { PWD, NODE_ENV: environment = 'development' } } = process;

export default async function dbDrop() {
  require(`${PWD}/node_modules/babel-core/register`);

  const {
    [environment]: {
      database,
      ...config
    }
  } = require(`${PWD}/config/database.json`);

  const { schema } = connect(config);
  const query = schema.raw(`DROP DATABASE IF EXISTS ${database}`);

  query.on('query', () => console.log(query.toString()));
  await query;
}
