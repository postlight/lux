// @flow
import { green, yellow } from 'chalk';

import { line } from '../../logger';

/**
 * @private
 */
class MigrationsPendingError extends Error {
  constructor(migrations?: Array<string> = []) {
    const pending = migrations
      .map(str => yellow(str.substr(0, str.length - 3)))
      .join(', ');

    super(line`
      The following migrations are pending ${pending}.
      Please run ${green('lux db:migrate')} before starting your application.
    `);
  }
}

export default MigrationsPendingError;
