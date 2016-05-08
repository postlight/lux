import path from 'path';
import { spawn } from 'child_process';

import exec from '../src/packages/cli/utils/exec';

let app;

before(async done => {
  const testApp = path.join(__dirname, 'test-app');

  const options = {
    cwd: testApp,
    env: {
      ...process.env,
      PWD: testApp
    }
  };

  await exec('lux db:reset', options);
  await exec('lux db:migrate', options);
  await exec('lux db:seed', options);

  app = spawn('lux', ['serve'], options);

  app.once('error', done);

  app.stdout.setEncoding('utf8');
  app.stderr.setEncoding('utf8');

  app.stdout.on('data', data => {
    const isListening = /^.+listening\son\sport\s\d+\n$/g.test(data);

    if (isListening) {
      done();
    }
  });

  app.stderr.once('data', err => {
    err = new Error(err);
    done(err);
  });
});

after(() => {
  if (app) {
    app.kill();
  }
});
