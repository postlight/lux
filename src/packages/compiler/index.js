// @flow
import path from 'path';

import json from 'rollup-plugin-json';
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import nodeResolve from 'rollup-plugin-node-resolve';
import { rollup } from 'rollup';

import { BACKSLASH } from '../../constants';
import { rmrf, readdir, readdirRec, isJSFile } from '../fs';
import template from '../template';

import normalizePath from './utils/normalize-path';
import createManifest from './utils/create-manifest';
import createBootScript from './utils/create-boot-script';
import { default as onwarn } from './utils/handle-warning';

/**
 * @private
 */
export async function compile(dir: string, env: string, {
  useStrict = false
}: {
  useStrict: boolean
} = {}): Promise<void> {
  let banner;

  const local = path.join(__dirname, '..', 'src', 'index.js');
  const entry = path.join(dir, 'dist', 'index.js');

  const nodeModules = path.join(dir, 'node_modules');
  const luxNodeModules = path.join(__dirname, '..', 'node_modules');
  const sourceMapSupport = path.join(luxNodeModules, 'source-map-support');

  const external = await Promise.all([
    readdir(nodeModules),
    readdir(luxNodeModules)
  ]).then(([a, b]: [Array<string>, Array<string>]) => (
    a.concat(b).filter(name => name !== 'lux-framework')
  ));

  const assets = await Promise.all([
    readdir(path.join(dir, 'app', 'models')),
    readdir(path.join(dir, 'db', 'migrate')),
    readdirRec(path.join(dir, 'app', 'controllers')),
    readdirRec(path.join(dir, 'app', 'serializers'))
  ]).then(types => {
    let [
      models,
      migrations,
      controllers,
      serializers
    ] = types;

    models = models.filter(isJSFile);
    migrations = migrations.filter(isJSFile);
    controllers = controllers.filter(isJSFile);
    serializers = serializers.filter(isJSFile);

    return new Map([
      ['Application', path.join('app', 'index.js')],
      ['config', path.join('config', 'environments', `${env}.js`)],
      ['controllers', controllers],
      ['database', path.join('config', 'database.js')],
      ['migrations', migrations],
      ['models', models],
      ['routes', path.join('app', 'routes.js')],
      ['seed', path.join('db', 'seed.js')],
      ['serializers', serializers]
    ]);
  });

  await Promise.all([
    createManifest(dir, assets, {
      useStrict
    }),

    createBootScript(dir, {
      useStrict
    })
  ]);

  const bundle = await rollup({
    entry,
    onwarn,
    external,

    plugins: [
      alias({
        resolve: ['.js'],
        app: normalizePath(path.join(dir, 'app')),
        LUX_LOCAL: normalizePath(local)
      }),

      json(),

      nodeResolve({
        preferBuiltins: true
      }),

      eslint({
        cwd: dir,
        parser: 'babel-eslint',
        useEslintrc: false,
        include: [
          path.join(dir, 'app', '**'),
        ],
        exclude: [
          path.join(dir, 'package.json'),
          path.join(__dirname, '..', 'src', '**')
        ]
      }),

      babel()
    ]
  });

  await rmrf(entry);

  banner = template`
    const srcmap = require('${
      sourceMapSupport.replace(BACKSLASH, '/')
    }').install({
      environment: 'node'
    });
  `;

  if (useStrict) {
    banner = `'use strict';\n\n${banner}`;
  }

  return await bundle.write({
    banner,
    dest: path.join(dir, 'dist', 'bundle.js'),
    format: 'cjs',
    sourceMap: true,
    useStrict: false
  });
}
