import { join as joinPath, resolve as resolvePath } from 'path';

import exec from '../src/utils/exec';
import tryCatch from '../src/utils/try-catch';

before(done => {
  process.once('ready', done);

  tryCatch(async () => {
    const path = resolvePath(__dirname, '..', 'test-app');

    await exec('lux build', {
      cwd: path
    });

    const {
      Application,
      config,
      database
    } = require(joinPath(path, 'dist', 'bundle'));

    await new Application({
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
