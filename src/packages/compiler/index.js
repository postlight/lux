/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'
import lux from 'rollup-plugin-lux'
import json from 'rollup-plugin-json'
import alias from 'rollup-plugin-alias'
import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import { rollup } from 'rollup'

import { NODE_ENV } from '@lux/constants'
import * as fse from '@lux/utils/fs-extras'
import type { Environment } from '@lux/types'

import { BANNER, STD_LIB } from './constants'
import onwarn from './utils/handle-warning'
import createManifest from './utils/create-manifest'
import createBootScript from './utils/create-boot-script'

export type Options = {
  directory: string,
  environment: Environment,
  useStrict?: boolean,
}

let cache

export const compile = async (options: Options): Promise<void> => {
  const { directory, environment, useStrict = false } = options
  const entry = path.join(directory, 'dist', 'index.js')
  let external = STD_LIB
  let banner

  const babelConfig = {
    babelrc: false,
  }

  const assets = await Promise.all([
    fs.readdir(path.join(directory, 'app', 'models')),
    fs.readdir(path.join(directory, 'db', 'migrate')),
    fse.readdirRec(path.join(directory, 'app', 'controllers')),
    fse.readdirRec(path.join(directory, 'app', 'serializers')),
    fs.readFile(path.join(directory, 'package.json')).then(JSON.parse),
    fs.readFile(path.join(directory, '.babelrc')).then(JSON.parse),
  ]).then(types => {
    let [models, migrations, controllers, serializers] = types

    models = models.filter(fse.isExt('.js'))
    migrations = migrations.filter(fse.isExt('.js'))
    controllers = controllers.filter(fse.isExt('.js'))
    serializers = serializers.filter(fse.isExt('.js'))

    const [, , , , packageInfo, babelRc] = types

    if (packageInfo.dependencies) {
      external = Object.keys(packageInfo.dependencies).concat(external)
    }

    Object.assign(babelConfig, babelRc)

    return new Map([
      ['Application', path.join('app', 'index.js')],
      ['config', path.join('config', 'environments', `${environment}.js`)],
      ['controllers', controllers],
      ['database', path.join('config', 'database.js')],
      ['migrations', migrations],
      ['models', models],
      ['routes', path.join('app', 'routes.js')],
      ['seed', path.join('db', 'seed.js')],
      ['serializers', serializers],
    ])
  })

  await Promise.all([
    createManifest(directory, assets, {
      useStrict,
    }),
    createBootScript(directory, {
      useStrict,
    }),
  ])

  const bundle = await rollup({
    cache,
    entry,
    external,
    onwarn,
    plugins: [
      alias({
        app: path.posix.join('/', ...directory.split(path.sep).concat('app')),
        resolve: ['.js'],
      }),
      json(),
      resolve(),
      babel(babelConfig),
      lux(path.resolve(path.sep, directory, 'app')),
      cleanup(),
    ],
    preferConst: true,
  })

  if (NODE_ENV === 'development') {
    cache = bundle
  }

  await fse.rmrf(entry)

  banner = BANNER

  if (useStrict) {
    banner = `'use strict';\n\n${banner}`
  }

  return bundle.write({
    banner,
    dest: path.join(directory, 'dist', 'bundle.js'),
    format: 'cjs',
    sourceMap: true,
    useStrict: false,
  })
}

export { default as onwarn } from './utils/handle-warning'
