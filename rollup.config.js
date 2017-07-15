import * as path from 'path'

import alias from 'rollup-plugin-alias'
import cleanup from 'rollup-plugin-cleanup'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'

import { dependencies } from './package.json'

const BANNER = `\
'use strict';

const srcmap = require('source-map-support').install({
  environment: 'node',
});

if (Object.entries === undefined) {
  require('object.entries').shim();
}

if (Object.values === undefined) {
  require('object.values').shim();
}
`

export default {
  banner: BANNER,
  external: Object.keys(dependencies).concat([
    'assert',
    'async_hooks',
    'buffer',
    'child_process',
    'cluster',
    'console',
    'constants',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'https',
    'inspector',
    'module',
    'net',
    'os',
    'path',
    'process',
    'punycode',
    'querystring',
    'readline',
    'repl',
    'stream',
    'string_decoder',
    'sys',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'v8',
    'vm',
    'zlib',

    'mz/child_process',
    'mz/crypto',
    'mz/dns',
    'mz/fs',
    'mz/readline',
    'mz/zlib',
  ]),
  format: 'cjs',
  plugins: [
    alias({
      '@lux': path.join(__dirname, 'src'),
    }),
    json(),
    babel(),
    resolve(),
    cleanup(),
  ],
  preferConst: true,
  sourceMap: true,
  useStrict: false,
}
