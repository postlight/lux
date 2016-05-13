import { tryCatchSync } from '../../../utils/try-catch';
import { ModuleMissingError } from '../../../errors';

import { VALID_DRIVERS } from '../constants';
import { InvalidDriverError } from '../errors';

const { env: { NODE_ENV = 'development' } } = process;

export default function connect(appPath, config = {}) {
  let knex;

  const {
    host,
    pool,
    socket,
    driver,
    database,
    username,
    password
  } = config;

  if (VALID_DRIVERS.indexOf(driver) < 0) {
    throw new InvalidDriverError(driver);
  }

  tryCatchSync(() => {
    knex = require(`${appPath}/node_modules/knex`);
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
        `${appPath}/db/${database}_${NODE_ENV}.sqlite` : undefined
    }
  });
}
