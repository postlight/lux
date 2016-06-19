import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';
import { readdirSync } from 'fs';
import { join as joinPath } from 'path';

const BANNER = `\
'use strict';

require('source-map-support').install({
  environment: 'node'
});
`;

const EXTERNAL = [
  'knex',
  'bundle',
  ...readdirSync(joinPath(__dirname, '..', 'node_modules'))
];

const ESLINT_CONFIG = {
  throwError: true,

  exclude: [
    joinPath(__dirname, '../node_modules/**'),
    joinPath(__dirname, '../package.json')
  ]
};

export default {
  banner: BANNER,
  external: EXTERNAL,
  sourceMap: true,

  // Disable use strict as it already appears in the banner.
  useStrict: false,

  plugins: [
    eslint(ESLINT_CONFIG),
    json(),
    babel(),
    nodeResolve({ preferBuiltins: true })
  ],
};
