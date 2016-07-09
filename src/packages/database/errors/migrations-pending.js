import { green, yellow } from 'chalk';

import { line } from '../../logger';

class MigrationsPendingError extends Error {
  constructor(migrations = []) {
    migrations = migrations
      .map(str => yellow(str.substr(0, str.length - 3)))
      .join(', ');

    super(line`
      The following migrations are pending ${migrations}.
      Please run ${green('lux db:migrate')} before starting your application.
    `);
  }
}

export default MigrationsPendingError;
