/* @flow */

import { join as joinPath } from 'path'

import { Migration } from '@lux/packages/database'
import { FreezeableMap } from '@lux/packages/freezeable'
import { createDefaultConfig } from '@lux/packages/config'
import merge from '@lux/utils/merge'
import chain from '@lux/utils/chain'
import { isObject } from '@lux/utils/is-type'

import formatKey from './format-key'

const SUFFIX_PATTERN = /^.+(Controller|Down|Serializer|Up)/

/**
 * @private
 */
function normalize(manifest: Object) {
  return Object.entries(manifest).reduce(
    (obj, [key, value]) => {
      if (SUFFIX_PATTERN.test(key)) {
        const suffix = key.replace(SUFFIX_PATTERN, '$1')
        const stripSuffix = source => source.replace(suffix, '')

        switch (suffix) {
          case 'Controller':
            obj.controllers.set(formatKey(key, stripSuffix), value)
            break

          case 'Serializer':
            obj.serializers.set(formatKey(key, stripSuffix), value)
            break

          case 'Up':
          case 'Down':
            obj.migrations.set(
              formatKey(key),
              Reflect.construct(Migration, [value]),
            )
            break

          default:
            break
        }
      } else {
        switch (key) {
          case 'Application':
          case 'routes':
          case 'seed':
            Reflect.set(obj, formatKey(key), value)
            break

          case 'config': {
            if (isObject(value)) {
              Reflect.set(obj, 'config', {
                ...merge(createDefaultConfig(), {
                  ...obj.config,
                  ...value,
                }),
              })
            }

            break
          }

          case 'database':
            Reflect.set(obj, 'config', {
              ...obj.config,
              database: value,
            })
            break

          default:
            obj.models.set(formatKey(key), value)
            break
        }
      }

      return obj
    },
    {
      config: {},
      controllers: new FreezeableMap(),
      migrations: new FreezeableMap(),
      models: new FreezeableMap(),
      serializers: new FreezeableMap(),
    },
  )
}

/**
 * @private
 */
export default function bundleFor(path: string): FreezeableMap<string, any> {
  const manifest: Object = Reflect.apply(require, null, [
    joinPath(path, 'dist', 'bundle'),
  ])

  return chain(manifest)
    .pipe(normalize)
    .pipe(Object.entries)
    .construct(FreezeableMap)
    .value()
    .freeze()
}
