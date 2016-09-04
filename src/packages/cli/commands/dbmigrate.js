import { CWD } from '../../../constants';

import Database, { pendingMigrations } from '../../database';
import Logger, { sql } from '../../logger';
import { createLoader } from '../../loader';

/**
 * @private
 */
export async function dbmigrate() {
  const load = createLoader(CWD);

  const { database: config } = load('config');
  const models = load('models');
  const migrations = load('migrations');

  const { connection, schema } = await new Database({
    config,
    models,
    path: CWD,
    checkMigrations: false,

    logger: new Logger({
      enabled: false
    })
  });

  const pending = await pendingMigrations(CWD, () => connection('migrations'));

  if (pending.length) {
    await Promise.all(
      pending.map(async (migration) => {
        const version = migration.replace(/^(\d{16})-.+$/g, '$1');
        migration = migration.replace(new RegExp(`${version}-(.+)\.js`), '$1');
        migration = migrations.get(`${migration}-up`);

        if (migration) {
          const query = migration.run(schema());

          await query.on('query', () => {
            process.stdout.write(sql`${query.toString()}\n`);
          });

          await connection('migrations').insert({
            version
          });
        }

        return migration;
      })
    );
  }
}
