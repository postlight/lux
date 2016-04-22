import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

import Promise from 'bluebird';

let app;

before(done => {
  const testApp = path.join(__dirname, 'test-app');

  app = spawn('lux', ['serve'], {
    cwd: testApp,
    env: {
      ...process.env,
      PWD: testApp
    }
  });

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
