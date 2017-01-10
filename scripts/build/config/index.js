'use strict';

require('../../../lib/babel-hook');

const path = require('path');

const json = require('rollup-plugin-json');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');

const { onwarn } = require('../../../src/packages/compiler');
const { default: template } = require('../../../src/packages/template');

const BANNER = template`
  'use strict';

  require('source-map-support').install({
    environment: 'node'
  });
`;

module.exports = {
  rollup: {
    onwarn,
    plugins: [
      json(),
      babel(),
      resolve({
        preferBuiltins: true
      })
    ],
    external(id) {
      return !(
        id.startsWith('.')
        || id.startsWith('/') // Absolute path on Unix
        || /^[A-Z]:[\\/]/.test(id) // Absolute path on Windows
        || id.startsWith('src')
        || id.startsWith(path.join('..', '..', '..', 'src'))
        || id === 'babelHelpers'
        || id === '\u0000babelHelpers'
      );
    },
  },
  bundle: {
    banner: BANNER,
    format: 'cjs',
    sourceMap: true,
    useStrict: false
  }
};
