/* @flow */

import type Database from '../index'

/**
 * @private
 */
export default async function createMigrations(
  schema: $PropertyType<Database, 'schema'>
): Promise<boolean> {
  const hasTable: boolean = await schema().hasTable('migrations')

  if (!hasTable) {
    await schema().createTable('migrations', table => {
      table.string('version', 16).primary()
    })
  }

  return true
}
