import { CWD } from '../../../constants'
import Logger from '../../logger'
import Database from '../../database'
import { createLoader } from '../../loader'

/**
 * @private
 */
export function dbseed() {
  const load = createLoader(CWD)
  const { database: config } = load('config')
  const seed = load('seed')
  const models = load('models')

  return new Database({
    config,
    models,
    path: CWD,
    logger: new Logger({
      enabled: false
    })
  }).then(store => (
    store.connection.transaction(trx => seed(trx, store.connection))
  ))
}
