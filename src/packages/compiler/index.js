// @flow
import os from 'os';
import path, { posix } from 'path';

import json from 'rollup-plugin-json';
import alias from 'rollup-plugin-alias';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import { rollup } from 'rollup';

import { rmrf, readdir, readdirRec, isJSFile } from '../fs';
import template from '../template';

import onwarn from './utils/handle-warning';
import isExternal from './utils/is-external';
import createManifest from './utils/create-manifest';
import createBootScript from './utils/create-boot-script';

/**
 * @private
 */
export async function compile(dir: string, env: string, {
  useStrict = false
}: {
  useStrict: boolean
} = {}): Promise<void> {
  const local = path.join(__dirname, '..', 'src', 'index.js');
  const entry = path.join(dir, 'dist', 'index.js');
  const external = isExternal(dir);
  let banner;

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

  const aliases = {
    app: posix.join('/', ...(dir.split(path.sep)), 'app'),
    LUX_LOCAL: posix.join('/', ...(local.split(path.sep)))
  };

  if (os.platform() === 'win32') {
    const [volume] = dir;
    const prefix = `${volume}:/`;

    Object.assign(aliases, {
      app: aliases.app.replace(prefix, ''),
      LUX_LOCAL: aliases.LUX_LOCAL.replace(prefix, '')
    });
  }

  const bundle = await rollup({
    entry,
    onwarn,
    external,
    plugins: [
      alias({
        resolve: ['.js'],
        ...aliases
      }),
      json(),
      resolve({
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
      babel({
        exclude: 'node_modules/**'
      })
    ]
  });

  await rmrf(entry);

  banner = template`
    const srcmap = require('source-map-support').install({
      environment: 'node'
    });
  `;

  if (useStrict) {
    banner = `'use strict';\n\n${banner}`;
  }

  return bundle.write({
    banner,
    dest: path.join(dir, 'dist', 'bundle.js'),
    format: 'cjs',
    sourceMap: true,
    useStrict: false
  });
}

export { default as onwarn } from './utils/handle-warning';
