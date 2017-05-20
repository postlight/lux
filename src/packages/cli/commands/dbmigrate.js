import { EOL } from 'os'

import { CWD } from '../../../constants'
import Database, { pendingMigrations } from '../../database'
import Logger, { sql } from '../../logger'
import { createLoader } from '../../loader'
import { composeAsync } from '../../../utils/compose'

/**
 * @private
 */
export async function dbmigrate() {
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
      enabled: false
    })
  })

  const pending = await pendingMigrations(CWD, () => connection('migrations'))

  if (pending.length) {
    const runners = pending
      .map(name => {
        const version = name.replace(/^(\d{16})-.+$/g, '$1')
        const key = name.replace(new RegExp(`${version}-(.+)\\.js`), '$1')

        return [version, migrations.get(`${key}-up`)]
      })
      .filter(([, migration]) => Boolean(migration))
      .reverse()
      .map(([version, migration]) => () => {
        const query = migration.run(schema())

        return query
          .on('query', () => {
            process.stdout.write(sql`${query.toString()}`)
            process.stdout.write(EOL)
          })
          .then(() => (
            connection('migrations').insert({
              version
            })
          ))
      })

    await composeAsync(...runners)()
  }

  return true
}
