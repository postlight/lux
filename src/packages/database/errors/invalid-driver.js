import { green, yellow } from 'chalk';

import { VALID_DRIVERS } from '../constants';

import { line } from '../../logger';

class InvalidDriverError extends Error {
  friendly = true;

  constructor(driver) {
    super(line`
      Invalid database driver ${yellow(driver)} in ./config/database.js.
      Please use one of the following database drivers:
      ${VALID_DRIVERS.map(d => green(d)).join(', ')}.
    `);
  }
}

export default InvalidDriverError;
