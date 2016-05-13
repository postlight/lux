import Promise from 'bluebird';

import Database, { createMigrations, pendingMigrations } from '../../database';
import Logger, { sql } from '../../logger';

const { env: { PWD } } = process;

export default async function dbMigrate() {
  require(`${PWD}/node_modules/babel-core/register`);

  const { connection, schema } = new Database({
    path: PWD,
    config: require(`${PWD}/config/database`).default,

    logger: await Logger.create({
      appPath: PWD,
      enabled: false
    })
  });

  await createMigrations(schema);
  const pending = await pendingMigrations(PWD, () => connection('migrations'));

  if (pending.length) {
    await Promise.all(
      pending.map(async (migration) => {
        const version = migration.replace(/^(\d{16})-.+$/g, '$1');
        let { up } = require(`${PWD}/db/migrate/${migration}`);

        up = up(schema());

        up.on('query', () => console.log(sql`${up.toString()}`));
        await up;

        await connection('migrations').insert({ version });
      })
    );
  }
}
