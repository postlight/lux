export default async function createMigrationsTable(schema) {
  const hasTable = await schema().hasTable('migrations');

  if (!hasTable) {
    await schema().createTable('migrations', table => {
      table.string('version', 16).primary();
    });
  }

  return true;
}
