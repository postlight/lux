import path from 'path';

import Logger from '../dist/packages/logger';
import exec from '../dist/packages/cli/utils/exec';

const { assign } = Object;
const { env: { NODE_ENV = 'development' } } = process;

before(async done => {
  process.once('ready', done);

  const appPath = path.join(__dirname, 'test-app');
  const options = { cwd: appPath };

  await exec('lux db:reset', options);
  await exec('lux db:migrate', options);
  await exec('lux db:seed', options);

  const TestApp = require(`${appPath}/bin/app`);

  const {
    default: config
  } = require(`./test-app/config/environments/${NODE_ENV}`);

  assign(config, {
    port: 4000,
    path: appPath,
    logger: await Logger.create()
  });

  await new TestApp(config).boot();
});
