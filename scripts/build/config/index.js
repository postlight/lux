'use strict';

require('../../../lib/babel-hook');

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
      return /^(?![./\\]+|[A-Z]:\\.+\\src|src|\u0000?babelHelpers)/.test(id);
    },
  },
  bundle: {
    banner: BANNER,
    format: 'cjs',
    sourceMap: true,
    useStrict: false
  }
};
