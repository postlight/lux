// @flow

/**
 * @private
 */
export default async function createMigrations(schema: Function) {
  const hasTable = await schema().hasTable('migrations');

  if (!hasTable) {
    await schema().createTable('migrations', table => {
      table.string('version', 16).primary();
    });
  }

  return true;
}
