'use strict';

const path = require('path');
const { execSync } = require('child_process');

const createShell = cwd => cmd => {
  try {
    console.log(cmd);

    execSync(cmd, {
      cwd,
      env: Object.assign({}, process.env, {
        PATH: `${process.env.PATH || ''}:${path.join(
          __dirname,
          '..',
          'node_modules',
          '.bin'
        )}`,
        NODE_ENV: 'test',
      }),
      stdio: 'inherit',
      encoding: 'utf8',
    });
  } catch (err) {
    process.exit(1);
  }
};

const appSh = createShell(path.join(__dirname, 'test-app'));
const mainSh = createShell(path.join(__dirname, '..'));

appSh('lux build -e test');
appSh('lux db:migrate -e test --skip-build');
appSh('lux db:seed -e test --skip-build');
mainSh(`jest ${process.argv.slice(2).join(' ')}`);
