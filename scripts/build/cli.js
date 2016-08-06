'use strict';

require('../../lib/babel-hook');

const path = require('path');
const rollup = require('rollup').rollup;

const fs = require('../../src/packages/fs');
const dist = path.join(__dirname, '..', '..', 'dist');
const config = require('./config');
const commands = path.join(
  __dirname,
  '..',
  '..',
  'src',
  'packages',
  'cli',
  'commands'
);

fs.readdir(commands)
  .then(files => {
    return Promise.all(
      files.map(file => {
        const cmdConfig = {
          rollup: Object.assign({}, config.rollup, {
            entry: path.join(commands, file),
          }),

          bundle: Object.assign({}, config.bundle, {
            dest: path.join(dist, file)
          })
        };

        return rollup(cmdConfig.rollup).then(bundle => {
          return bundle.write(cmdConfig.bundle);
        });
      })
    );
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
