export default async function createMigrations(schema) {
  const hasTable = await schema().hasTable('migrations');

  if (!hasTable) {
    await schema().createTable('migrations', table => {
      table.string('version', 16).primary();
    });
  }

  return true;
}
