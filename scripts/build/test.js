'use strict';

const path = require('path');
const rollup = require('rollup').rollup;

// Plugins
const babel = require('rollup-plugin-babel');
const multiEntry = require('rollup-plugin-multi-entry');
const nodeResolve = require('rollup-plugin-node-resolve');

let config = require('./config');

config = {
  rollup: Object.assign({}, config.rollup, {
    entry: [
      path.join(__dirname, '..', '..', 'test', 'index.js'),
      path.join(__dirname, '..', '..', 'test', 'unit', '**', '*.js'),
      path.join(__dirname, '..', '..', 'test', 'integration', '**', '*.js')
    ],

    plugins: [
      babel(),
      multiEntry(),
      nodeResolve({ preferBuiltins: true })
    ]
  }),

  bundle: Object.assign({}, config.bundle, {
    dest: path.join(__dirname, '..', '..', 'test', 'dist', 'index.js')
  })
};

rollup(config.rollup)
  .then(bundle => bundle.write(config.bundle))
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
