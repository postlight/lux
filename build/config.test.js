import babel from 'rollup-plugin-babel';
import multiEntry from 'rollup-plugin-multi-entry';
import nodeResolve from 'rollup-plugin-node-resolve';
import { join as joinPath } from 'path';

import config from './config';

export default Object.assign(config, {
  entry: [
    joinPath(__dirname, '..', 'test', 'index.js'),
    joinPath(__dirname, '..', 'test', 'unit', '**', '*.js'),
    joinPath(__dirname, '..', 'test', 'integration', '**', '*.js'),
  ],

  plugins: [
    babel(),
    multiEntry(),
    nodeResolve({ preferBuiltins: true })
  ]
});
