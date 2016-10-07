import { EOL } from 'os';

import { CWD, NODE_ENV, DATABASE_URL } from '../../../constants';
import { CONNECTION_STRING_MESSAGE } from '../constants';
import { rmrf } from '../../fs';
import { connect } from '../../database';
import { createLoader } from '../../loader';

/**
 * @private
 */
export async function dbdrop() {
  const load = createLoader(CWD);

  const {
    database: {
      [NODE_ENV]: {
        driver,
        database,
        url,
        ...config
      }
    }
  } = load('config');

  if (driver === 'sqlite3') {
    await rmrf(`${CWD}/db/${database}_${NODE_ENV}.sqlite`);
  } else {
    if (DATABASE_URL || url) {
      process.stderr.write(CONNECTION_STRING_MESSAGE);
      process.stderr.write(EOL);
      return;
    }

    const { schema } = connect(CWD, { ...config, driver });
    const query = schema.raw(`DROP DATABASE IF EXISTS ${database}`);

    query.on('query', () => {
      process.stdout.write(query.toString());
      process.stdout.write(EOL);
    });

    await query;
  }
}
