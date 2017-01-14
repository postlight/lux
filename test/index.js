// @flow
import { before } from 'mocha';
import { resolve as resolvePath } from 'path';

import exec from '../src/utils/exec';
import tryCatch from '../src/utils/try-catch';

import { getTestApp } from './utils/get-test-app';

const { env: { APPVEYOR, CIRCLECI, CIRCLE_NODE_INDEX } } = process;

before(function (done) {
  this.timeout(120000);

  process.once('ready', done);

  tryCatch(async () => {
    const path = resolvePath(__dirname, 'test-app');

    const execOpts = {
      cwd: path,
      env: {
        ...process.env
      }
    };

    if (APPVEYOR) {
      // Do nothing for now.
    } else if (CIRCLECI) {
      const create = 'CREATE DATABASE lux_test;';
      const drop = 'DROP DATABASE IF EXISTS lux_test;';
      let driver;

      switch (CIRCLE_NODE_INDEX) {
        case '0':
          driver = 'pg';
          await exec(`psql -c "${drop}" -U postgres`, execOpts);
          await exec(`psql -c "${create}" -U postgres`, execOpts);
          break;

        case '1':
          driver = 'mysql2';
          await exec(`mysql -e "${drop}"`, execOpts);
          await exec(`mysql -e "${create}"`, execOpts);
          break;

        default:
          driver = 'sqlite3';
          await exec('lux db:reset', execOpts);
          break;
      }

      process.env.DATABASE_DRIVER = driver;
      execOpts.env.DATABASE_DRIVER = driver;

      console.log(`Starting test suite using database driver '${driver}.'`);
    } else {
      await exec('lux db:reset', execOpts);
    }

    await exec('lux db:migrate', execOpts);
    await exec('lux db:seed', execOpts);

    await getTestApp();
  }, (err) => {
    process.removeListener('ready', done);
    done(err);
  });
});
