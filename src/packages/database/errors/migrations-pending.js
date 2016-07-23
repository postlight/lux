// @flow
import { green, yellow } from 'chalk';

import { line } from '../../logger';

class MigrationsPendingError extends Error {
  constructor(migrations?: Array<string> = []): MigrationsPendingError {
    const pending = migrations
      .map(str => yellow(str.substr(0, str.length - 3)))
      .join(', ');

    super(line`
      The following migrations are pending ${pending}.
      Please run ${green('lux db:migrate')} before starting your application.
    `);

    return this;
  }
}

export default MigrationsPendingError;
