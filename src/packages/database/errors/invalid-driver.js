// @flow
import { green, yellow } from 'chalk';

import { VALID_DRIVERS } from '../constants';

import { line } from '../../logger';

/**
 * @private
 */
class InvalidDriverError extends Error {
  constructor(driver: string) {
    super(line`
      Invalid database driver ${yellow(driver)} in ./config/database.js.
      Please use one of the following database drivers:
      ${VALID_DRIVERS.map(green).join(', ')}.
    `);
  }
}

export default InvalidDriverError;
