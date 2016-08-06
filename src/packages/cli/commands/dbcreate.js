import { CWD, NODE_ENV } from '../../../constants';

import loader from '../../loader';
import { connect } from '../../database';
import { writeFile } from '../../fs';

/**
 * @private
 */
export async function dbcreate() {
  const {
    database: {
      [NODE_ENV]: {
        driver,
        database,
        ...config
      }
    }
  } = loader(CWD, 'config');

  if (driver === 'sqlite3') {
    await writeFile(`${CWD}/db/${database}_${NODE_ENV}.sqlite`, '');
  } else {
    const { schema } = connect(CWD, { ...config, driver });
    const query = schema.raw(`CREATE DATABASE ${database}`);

    query.on('query', () => console.log(query.toString()));
    await query;
  }
}
