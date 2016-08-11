import { CWD, NODE_ENV, DATABASE_URL } from '../../../constants';
import { connect } from '../../database';
import { rmrf } from '../../fs';
import loader from '../../loader';
import urlMessage from '../utils/url-message';

/**
 * @private
 */
export async function dbdrop() {
  const {
    database: {
      [NODE_ENV]: {
        driver,
        database,
        url,
        ...config
      }
    }
  } = loader(CWD, 'config');

  if (driver === 'sqlite3') {
    await rmrf(`${CWD}/db/${database}_${NODE_ENV}.sqlite`);
  } else {
    if (DATABASE_URL || url) {
      return urlMessage();
    }
    const { schema } = connect(CWD, { ...config, driver });
    const query = schema.raw(`DROP DATABASE IF EXISTS ${database}`);

    query.on('query', () => console.log(query.toString()));
    await query;
  }
}
