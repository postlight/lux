import { join as joinPath } from 'path';

import { NODE_ENV, DATABASE_URL } from '../../../constants';
import { VALID_DRIVERS } from '../constants';
import { tryCatchSync } from '../../../utils/try-catch';
import { InvalidDriverError } from '../errors';
import ModuleMissingError from '../../../errors/module-missing-error';

/**
 * @private
 */
export default function connect(path, config = {}) {
  let knex;
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
      min: 1,
      max: pool
    };
  }

  tryCatchSync(() => {
    knex = Reflect.apply(require, null, [
      joinPath(path, 'node_modules', 'knex')
    ]);
  }, () => {
    throw new ModuleMissingError('knex');
  });

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
