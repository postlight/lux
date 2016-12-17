'use strict';

const IS_NODE_SEVEN = process.version.charAt(1) === '7';
const HAS_HARMONY_FLAG = process.execArgv.includes('--harmony');

const plugins = (...items) => {
  const defaultPlugins = [
    'transform-class-properties',
    'transform-flow-strip-types',
    'transform-es2015-modules-commonjs',
    ['transform-object-rest-spread', {
      useBuiltIns: true
    }]
  ];

  if (!IS_NODE_SEVEN) {
    defaultPlugins.push(
      'babel-plugin-transform-exponentiation-operator',
      'babel-plugin-transform-async-to-generator'
    );
  } else if (!HAS_HARMONY_FLAG) {
    defaultPlugins.push('babel-plugin-transform-async-to-generator');
  }

  return items.concat(defaultPlugins);
};

// eslint-disable-next-line import/no-extraneous-dependencies
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
