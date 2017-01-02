import { join as joinPath } from 'path';

import type Knex from 'knex';

import { NODE_ENV, DATABASE_URL } from '../../../constants';
import { VALID_DRIVERS } from '../constants';
import { InvalidDriverError } from '../errors';

/**
 * @private
 */
export default function connect(path: string, config: Object = {}): Knex {
  let { pool } = config;

  const {
    host,
    socket,
    driver,
    database,
    username,
    password,
    port,
    ssl,
    url
  } = config;

  if (VALID_DRIVERS.indexOf(driver) < 0) {
    throw new InvalidDriverError(driver);
  }

  if (pool && typeof pool === 'number') {
    pool = {
      min: pool > 1 ? 2 : 1,
      max: pool
    };
  }

  const knex: Class<Knex> = require(joinPath(path, 'node_modules', 'knex'));
  const usingSQLite = driver === 'sqlite3';

  const connection = DATABASE_URL || url || {
    host,
    database,
    password,
    port,
    ssl,
    user: username,
    socketPath: socket,
    filename: usingSQLite ?
    joinPath(path, 'db', `${database || 'default'}_${NODE_ENV}.sqlite`)
    : undefined
  };

  return knex({
    pool,
    connection,
    debug: false,
    client: driver,
    useNullAsDefault: usingSQLite
  });
}
