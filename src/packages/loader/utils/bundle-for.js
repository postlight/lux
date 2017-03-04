/* @flow */

import { join as joinPath } from 'path';

import { Migration } from '../../database';
import { FreezeableMap } from '../../freezeable';
import { createDefaultConfig } from '../../config';
import merge from '../../../utils/merge';
import chain from '../../../utils/chain';
import entries from '../../../utils/entries';

import formatKey from './format-key';

const SUFFIX_PATTERN = /^.+(Controller|Down|Serializer|Up)/;

/**
 * @private
 */
function normalize(manifest: Object) {
  return entries(manifest).reduce((obj, [key, value]) => {
    if (SUFFIX_PATTERN.test(key)) {
      const suffix = key.replace(SUFFIX_PATTERN, '$1');
      const stripSuffix = source => source.replace(suffix, '');

      switch (suffix) {
        case 'Controller':
          obj.controllers.set(formatKey(key, stripSuffix), value);
          break;

        case 'Serializer':
          obj.serializers.set(formatKey(key, stripSuffix), value);
          break;

        case 'Up':
        case 'Down':
          obj.migrations.set(
            formatKey(key),
            Reflect.construct(Migration, [value])
          );
          break;

        default:
          break;
      }
    } else {
      switch (key) {
        case 'Application':
        case 'routes':
        case 'seed':
          Reflect.set(obj, formatKey(key), value);
          break;

        case 'config':
          Reflect.set(obj, 'config', {
            ...merge(createDefaultConfig(), {
              ...obj.config,
              ...value
            })
          });
          break;

        case 'database':
          Reflect.set(obj, 'config', {
            ...obj.config,
            database: value
          });
          break;

        default:
          obj.models.set(formatKey(key), value);
          break;
      }
    }

    return obj;
  }, {
    config: {},
    controllers: new FreezeableMap(),
    migrations: new FreezeableMap(),
    models: new FreezeableMap(),
    serializers: new FreezeableMap()
  });
}

/**
 * @private
 */
export default function bundleFor(path: string): FreezeableMap<string, any> {
  const manifest: Object = Reflect.apply(require, null, [
    joinPath(path, 'dist', 'bundle')
  ]);

  return chain(manifest)
    .pipe(normalize)
    .pipe(entries)
    .construct(FreezeableMap)
    .value()
    .freeze();
}
