/* @flow */

import { EOL } from 'os'

import { writeFile } from 'mz/fs'

import { CWD, NODE_ENV, DATABASE_URL } from '@lux/constants'
import { CONNECTION_STRING_MESSAGE } from '../constants'
import DatabaseConfigMissingError from '../errors/database-config-missing'
import { connect } from '@lux/packages/database'
import { createLoader } from '@lux/packages/loader'

/**
 * @private
 */
export function dbcreate() {
  const load = createLoader(CWD)
  const config = Reflect.get(load('config').database, NODE_ENV)

  if (!config) {
    throw new DatabaseConfigMissingError(NODE_ENV)
  }

  if (config.driver === 'sqlite3') {
    return writeFile(
      `${CWD}/db/${config.database}_${NODE_ENV}.sqlite`,
      Buffer.from(''),
    )
  }

  if (DATABASE_URL || config.url) {
    process.stderr.write(CONNECTION_STRING_MESSAGE)
    process.stderr.write(EOL)
    return Promise.resolve()
  }

  const { schema } = connect(CWD, config)
  const query = `CREATE DATABASE ${config.database}`

  return schema.raw(query).once('query', () => {
    process.stdout.write(query)
    process.stdout.write(EOL)
  })
}
