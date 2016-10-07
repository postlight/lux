import { EOL } from 'os';

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
      pending.map(async migration => {
        const version = migration.replace(/^(\d{16})-.+$/g, '$1');
        const key = migration.replace(new RegExp(`${version}-(.+)\.js`), '$1');
        const value = migrations.get(`${key}-up`);

        if (value) {
          const query = value.run(schema());

          await query.on('query', () => {
            process.stdout.write(sql`${query.toString()}`);
            process.stdout.write(EOL);
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
