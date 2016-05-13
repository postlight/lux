import Database, { createMigrations } from '../../database';
import Logger, { sql } from '../../logger';
import fs from '../../fs';

const { env: { PWD } } = process;

export default async function dbRollback() {
  require(`${PWD}/node_modules/babel-core/register`);

  const { connection, schema } = new Database({
    path: PWD,
    logger: await Logger.create(),
    config: require(`${PWD}/config/database`).default
  });

  const migrations = await fs.readdirAsync(`${PWD}/db/migrate`);

  await createMigrations(schema);

  if (migrations.length) {
    let version = await connection('migrations')
      .orderBy('version', 'desc')
      .first();

    if (version && version.version) {
      version = version.version;
    }

    const target = migrations.find(migration => {
      return migration.indexOf(version) === 0;
    });

    if (target) {
      let { down } = require(`${PWD}/db/migrate/${target}`);

      down = down(schema());

      down.on('query', () => console.log(sql`${down.toString()}`));
      await down;

      await connection('migrations').where({ version }).del();
    }
  }
}
