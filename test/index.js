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

    if (CIRCLECI) {
      switch (CIRCLE_NODE_INDEX) {
        case '0':
          execOpts.env.DATABASE_DRIVER = 'pg';
          break;

        case '1':
          execOpts.env.DATABASE_DRIVER = 'mysql2';
          break;

        case '2':
          execOpts.env.DATABASE_DRIVER = 'sqlite3';
          break;
      }

      process.env.DATABASE_DRIVER = execOpts.env.DATABASE_DRIVER;
    }

    await exec('lux db:reset', execOpts);
    await exec('lux db:migrate', execOpts);
    await exec('lux db:seed', execOpts);

    await getTestApp();
  }, (err) => {
    process.removeListener('ready', done);
    done(err);
  });
});
