import path from 'path';

import { Migration } from '../database';

import entries from '../../utils/entries';
import formatKey from './utils/format-key';

let bundle: Map<string, any>;

/**
 * @private
 */
export default function loader(appPath: string, type: string): ?mixed {
  if (!bundle) {
    const pattern = /^.+(Controller|Down|Serializer|Up)/g;
    const manifest = require(path.join(appPath, 'dist', 'bundle'));

    if (typeof manifest === 'object') {
      bundle = new Map(
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
                    key = formatKey(key, k => k.replace(match, ''));
                    hash.controllers.set(key, value);
                    break;

                  case 'Serializer':
                    key = formatKey(key, k => k.replace(match, ''));
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
                  hash.config = {
                    ...hash.config,
                    ...value
                  };
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
            controllers: new Map(),
            migrations: new Map(),
            models: new Map(),
            serializers: new Map()
          })
        )
      );
    }
  }

  return bundle.get(type);
}
