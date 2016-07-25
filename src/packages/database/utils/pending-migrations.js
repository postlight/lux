import fs from '../../fs';

/**
 * @private
 */
export default async function pendingMigrations(appPath, table) {
  const migrations = await fs.readdirAsync(`${appPath}/db/migrate`);
  const versions = await table().select().map(({ version }) => version);

  return migrations.filter(migration => {
    return versions.indexOf(
      migration.replace(/^(\d{16})-.+$/g, '$1')
    ) < 0;
  });
}
