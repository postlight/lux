import fs from '../../fs';

const { env: { PWD } } = process;

export default async function getPendingMigrations(table) {
  const migrations = await fs.readdirAsync(`${PWD}/db/migrate`);
  const versions = await table().select().map(({ version }) => version);

  return migrations.filter(migration => {
    return versions.indexOf(
      migration.replace(/^(\d{16})-.+$/g, '$1')
    ) < 0;
  });
}
