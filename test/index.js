// @flow
import { before } from 'mocha';
import { resolve as resolvePath } from 'path';

import exec from '../src/utils/exec';
import tryCatch from '../src/utils/try-catch';

import { getTestApp } from './utils/get-test-app';

const { env: { APPVEYOR, TRAVIS } } = process;

before(function (done) {
  this.timeout(120000);

  process.once('ready', done);

  tryCatch(async () => {
    const path = resolvePath(__dirname, '..', 'test-app');
    const execOpts = { cwd: path };

    if (!APPVEYOR && !TRAVIS) {
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
