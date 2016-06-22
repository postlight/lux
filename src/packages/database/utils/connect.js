import { join as joinPath } from 'path';

import { NODE_ENV } from '../../../constants';
import { VALID_DRIVERS } from '../constants';

import { tryCatchSync } from '../../../utils/try-catch';

import { ModuleMissingError } from '../../../errors';
import { InvalidDriverError } from '../errors';

export default function connect(path, config = {}) {
  let knex;
  let { pool } = config;

  const {
    host,
    socket,
    driver,
    database,
    username,
    password
  } = config;

  if (VALID_DRIVERS.indexOf(driver) < 0) {
    throw new InvalidDriverError(driver);
  }

  if (pool && typeof pool === 'number') {
    pool = {
      min: 0,
      max: pool
    };
  }

  tryCatchSync(() => {
    knex = require(joinPath(path, 'node_modules', 'knex'));
  }, () => {
    throw new ModuleMissingError('knex');
  });

  const usingSQLite = driver === 'sqlite3';

  return knex({
    pool,
    debug: false,
    client: driver,
    useNullAsDefault: usingSQLite,

    connection: {
      host,
      database,
      password,
      user: username,
      socketPath: socket,

      filename: usingSQLite ?
        joinPath(path, 'db', `${database}_${NODE_ENV}.sqlite`)
        : undefined
    }
  });
}
