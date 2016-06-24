import { CWD, NODE_ENV } from '../../../constants';
import { connect } from '../../database';
import { rmrf } from '../../fs';
import loader from '../../loader';

/**
 * @private
 */
export async function dbdrop() {
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
    await rmrf(`${CWD}/db/${database}_${NODE_ENV}.sqlite`);
  } else {
    const { schema } = connect(CWD, { ...config, driver });
    const query = schema.raw(`DROP DATABASE IF EXISTS ${database}`);

    query.on('query', () => console.log(query.toString()));
    await query;
  }
}
