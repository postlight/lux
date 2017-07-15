import { EOL } from 'os'

import { readdir } from 'mz/fs'

import { CWD } from '@lux/constants'
import Database from '@lux/packages/database'
import Logger, { sql } from '@lux/packages/logger'
import { createLoader } from '@lux/packages/loader'

/**
 * @private
 */
export async function dbrollback() {
  const load = createLoader(CWD)

  const { database: config } = load('config')
  const models = load('models')
  const migrations = load('migrations')

  const { connection, schema } = await new Database({
    config,
    models,
    path: CWD,
    checkMigrations: false,

    logger: new Logger({
      enabled: false,
    }),
  })

  const migrationFiles = await readdir(`${CWD}/db/migrate`)

  if (migrationFiles.length) {
    let migration
    let version = await connection('migrations')
      .orderBy('version', 'desc')
      .first()

    if (version && version.version) {
      version = version.version
    }

    const target = migrationFiles.find(m => m.indexOf(version) === 0)

    if (target) {
      migration = target.replace(new RegExp(`${version}-(.+)\\.js`), '$1')
      migration = migrations.get(`${migration}-down`)

      if (migration) {
        const query = migration.run(schema())

        await query.on('query', () => {
          process.stdout.write(sql`${query.toString()}`)
          process.stdout.write(EOL)
        })

        await connection('migrations')
          .where({
            version,
          })
          .del()
      }
    }
  }
}
