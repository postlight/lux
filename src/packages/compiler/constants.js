/* @flow */

import template from '@lux/packages/template'

export const BANNER: string = template`
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

export const STD_LIB: Array<string> = [
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
]
