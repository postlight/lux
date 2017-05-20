/* @flow */

import type Knex from 'knex'

import type Logger from '../logger'

import { ModelMissingError } from './errors'
import Model from './model'
import initialize from './initialize'
import normalizeModelName from './utils/normalize-model-name'
import type { Database$opts } from './interfaces'

/**
 * @private
 */
class Database {
  path: string;

  debug: boolean;

  logger: Logger;

  config: Object;

  schema: () => $PropertyType<Knex, 'schema'>;

  connection: Knex;

  models: Map<string, Class<Model>>;

  constructor({
    path,
    models,
    config,
    logger,
    checkMigrations
  }: Database$opts): Promise<Database> {
    return initialize(this, {
      path,
      models,
      config,
      logger,
      checkMigrations
    })
  }

  /**
   * A boolean value representing whether or not connection pool configuration
   * has been supplied. This is used for determining wheter or not transactions
   * will be used when writing to the database.
   *
   * @property hasPool
   * @type {Boolean}
   */
  get hasPool(): boolean {
    return Boolean(this.config.pool)
  }

  modelFor(type: string): Class<Model> {
    const model = this.models.get(normalizeModelName(type))

    if (!model) {
      throw new ModelMissingError(type)
    }

    return model
  }
}

export default Database
export { default as Query } from './query'
export { default as Model, tableFor } from './model'
export { default as Migration, generateTimestamp } from './migration'
export { default as connect } from './utils/connect'
export { default as typeForColumn } from './utils/type-for-column'
export { default as createMigrations } from './utils/create-migrations'
export { default as pendingMigrations } from './utils/pending-migrations'

export type { Database$opts, Config } from './interfaces'
