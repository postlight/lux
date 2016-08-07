import { join as joinPath } from 'path';

import exec from '../src/utils/exec';
import tryCatch from '../src/utils/try-catch';

const {
  env: {
    PWD,
    TRAVIS = false,
    NODE_ENV = 'development'
  }
} = process;

before(done => {
  process.once('ready', done);

  tryCatch(async () => {
    const path = joinPath(__dirname, '../test-app');
    const options = { cwd: path };

    if (!TRAVIS) {
      await exec('lux db:reset', options);
    }

    await exec('lux db:migrate', options);
    await exec('lux db:seed', options);

    const {
      Application,
      config,
      database
    } = require(joinPath(path, 'dist/bundle'));

    global.app = await new Application({
      ...config,
      database,
      path,
      port: 4000
    });
  }, (err) => {
    process.removeListener('ready', done);
    done(err);
  });
});
