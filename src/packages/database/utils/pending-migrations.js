// @flow
import { readdir } from '../../fs';

/**
 * @private
 */
export default async function pendingMigrations(
  appPath: string,
  table: Function
): Promise<Array<string>> {
  const migrations = await readdir(`${appPath}/db/migrate`);
  const versions = await table().select().map(({ version }) => version);

  return migrations.filter(migration => versions.indexOf(
    migration.replace(/^(\d{16})-.+$/g, '$1')
  ) < 0);
}
