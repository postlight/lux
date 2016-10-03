'use strict';

/***************************************************************************
 * Require this module to use code in the /src dir prior to transpilation. *
 ***************************************************************************/

const plugins = (...items) => items.concat([
  'syntax-flow',
  'syntax-trailing-function-commas',
  'transform-async-to-generator',
  'transform-class-properties',
  'transform-es2015-destructuring',
  'transform-es2015-parameters',
  'transform-es2015-spread',
  'transform-exponentiation-operator',
  'transform-flow-strip-types',
  'transform-object-rest-spread',
  'transform-es2015-modules-commonjs'
]);

require('babel-core/register')({
  babelrc: false,
  plugins: plugins(),
  env: {
    test: {
      sourceMaps: 'inline',
      plugins: plugins(['istanbul', {
        include: [
          'src/**/*.js'
        ],
        exclude: [
          '**/test',
          '**/errors',
          '**/interfaces.js'
        ]
      }])
    }
  }
});
