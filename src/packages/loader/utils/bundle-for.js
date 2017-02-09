// @flow
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
    const result = obj;

    if (SUFFIX_PATTERN.test(key)) {
      const suffix = key.replace(SUFFIX_PATTERN, '$1');
      const stripSuffix = source => source.replace(suffix, '');

      switch (suffix) {
        case 'Controller':
          result.controllers.set(formatKey(key, stripSuffix), value);
          break;

        case 'Serializer':
          result.serializers.set(formatKey(key, stripSuffix), value);
          break;

        case 'Up':
        case 'Down':
          result.migrations.set(formatKey(key), new Migration(value));
          break;

        default:
          break;
      }
    } else {
      switch (key) {
        case 'Application':
        case 'routes':
        case 'seed':
          result[formatKey(key)] = value;
          break;

        case 'config':
          result.config = merge(createDefaultConfig(), {
            ...result.config,
            ...value
          });
          break;

        case 'database':
          result.config = {
            ...result.config,
            database: value
          };
          break;

        default:
          result.models.set(formatKey(key), value);
          break;
      }
    }

    return result;
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
  // $FlowIgnore
  const manifest: Object = require(joinPath(path, 'dist', 'bundle'));

  return chain(manifest)
    .pipe(normalize)
    .pipe(entries)
    .construct(FreezeableMap)
    .value()
    .freeze();
}
