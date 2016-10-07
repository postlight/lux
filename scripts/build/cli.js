'use strict'; // eslint-disable-line strict, lines-around-directive

require('../../lib/babel-hook');

const { EOL } = require('os');
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
  .then(files => Promise.all(
    files.map(file => {
      const cmdConfig = {
        rollup: Object.assign({}, config.rollup, {
          entry: path.join(commands, file),
        }),

        bundle: Object.assign({}, config.bundle, {
          dest: path.join(dist, file)
        })
      };

      return rollup(cmdConfig.rollup)
        .then(bundle => bundle.write(cmdConfig.bundle));
    })
  ))
  .catch(err => {
    process.stderr.write(err.stack);
    process.stderr.write(EOL);
    process.exit(1);
  });
