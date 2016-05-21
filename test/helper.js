global.external = require;

import path from 'path';
import Logger from '../src/packages/logger';

import exec from '../src/packages/cli/utils/exec';
import tryCatch from '../src/utils/try-catch';

const { assign } = Object;

const {
  env: {
    TRAVIS = false,
    NODE_ENV = 'development'
  }
} = process;

before(done => {
  process.once('ready', done);

  tryCatch(async () => {
    const appPath = path.join(__dirname, 'test-app');
    const options = { cwd: appPath };

    if (!TRAVIS) {
      await exec('lux db:reset', options);
    }

    await exec('lux db:migrate', options);
    await exec('lux db:seed', options);

    const TestApp = require(`${appPath}/bin/app`);

    const {
      default: config
    } = require(`./test-app/config/environments/${NODE_ENV}`);

    assign(config, {
      port: 4000,
      path: appPath,

      logger: await Logger.create({
        appPath,
        enabled: config.log
      })
    });

    await new TestApp(config).boot();
  }, done);
});
