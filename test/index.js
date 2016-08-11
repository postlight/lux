import { join as joinPath } from 'path';

import exec from '../src/utils/exec';
import tryCatch from '../src/utils/try-catch';

import { getTestApp } from './utils/get-test-app';

before(done => {
  process.once('ready', done);

  tryCatch(async () => {
    const path = joinPath(__dirname, '../test-app');
    const options = { cwd: path };

    if (!process.env.TRAVIS) {
      await exec('lux db:reset', options);
    }

    await exec('lux db:migrate', options);
    await exec('lux db:seed', options);

    await getTestApp();
  }, (err) => {
    process.removeListener('ready', done);
    done(err);
  });
});
