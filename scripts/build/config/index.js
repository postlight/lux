'use strict'; // eslint-disable-line strict, lines-around-directive

require('../../../lib/babel-hook');

const fs = require('fs');
const path = require('path');

// Plugins
const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const nodeResolve = require('rollup-plugin-node-resolve');

const template = require('../../../src/packages/template').default;

const BANNER = template`
  'use strict';

  require('source-map-support').install({
    environment: 'node'
  });
`;

module.exports = {
  rollup: {
    external: [
      'knex',
      'bundle',
      path.join(__dirname, '..', '..', '..', 'lib', 'fs', 'index.js'),
      ...fs.readdirSync(path.join(__dirname, '..', '..', '..', 'node_modules'))
    ],

    plugins: [
      json(),
      babel(),
      nodeResolve({ preferBuiltins: true })
    ]
  },

  bundle: {
    banner: BANNER,
    format: 'cjs',
    sourceMap: true,
    useStrict: false
  }
};
