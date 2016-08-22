import path from 'path';

import { Migration } from '../database';
import { FreezeableMap } from '../freezeable';
import { createDefaultConfig } from '../config';

import merge from '../../utils/merge';
import entries from '../../utils/entries';
import formatKey from './utils/format-key';

let bundle: FreezeableMap<string, any>;

/**
 * @private
 */
export default function loader(appPath: string, type: string): ?mixed {
  if (!bundle) {
    const pattern = /^.+(Controller|Down|Serializer|Up)/g;
    const manifest = require(path.join(appPath, 'dist', 'bundle'));

    if (typeof manifest === 'object') {
      bundle = new FreezeableMap(
        entries(
          entries(manifest).reduce((hash, [key, value]) => {
            if (pattern.test(key)) {
              let [match]: [?string] = key.match(pattern);

              if (match) {
                match = match.replace(pattern, '$1');

                switch (match) {
                  case 'Up':
                  case 'Down':
                    value = new Migration(value);
                    hash.migrations.set(formatKey(key), value);
                    break;

                  case 'Controller':
                    key = formatKey(key, target => target.replace(match, ''));
                    hash.controllers.set(key, value);
                    break;

                  case 'Serializer':
                    key = formatKey(key, target => target.replace(match, ''));
                    hash.serializers.set(key, value);
                    break;
                }
              }
            } else {
              switch (key) {
                case 'Application':
                case 'routes':
                case 'seed':
                  hash[formatKey(key)] = value;
                  break;

                case 'config':
                  hash.config = merge(createDefaultConfig(), {
                    ...hash.config,
                    ...value
                  });
                  break;

                case 'database':
                  hash.config.database = value;
                  break;

                default:
                  hash.models.set(formatKey(key), value);
                  break;
              }
            }

            return hash;
          }, {
            config: {},
            controllers: new FreezeableMap(),
            migrations: new FreezeableMap(),
            models: new FreezeableMap(),
            serializers: new FreezeableMap()
          })
        )
      );

      bundle.freeze();
    }
  }

  return bundle.get(type);
}

export type {
  Bundle$Models,
  Bundle$Controllers,
  Bundle$Serializers
} from './interfaces';
