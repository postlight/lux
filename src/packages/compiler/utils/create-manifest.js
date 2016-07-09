// @flow
import { join as joinPath } from 'path';
import { camelize, classify, pluralize } from 'inflection';

import { BACKSLASH } from '../constants';
import fs from '../../fs';

import tryCatch from '../../../utils/try-catch';
import underscore from '../../../utils/underscore';

/**
 * @private
 */
function exportStatement(
  name: string,
  path: string,
  isDefault: boolean = true
): string {
  path = path.replace(BACKSLASH, '/');

  if (isDefault) {
    return `export {\n  default as ${name}\n} from '../${path}';\n\n`;
  } else {
    return `export {\n  ${name}\n} from '../${path}';\n\n`;
  }
}

/**
 * @private
 */
export default async function createManifest(
  dir: string,
  assets: Map<string, Array<string> | string>,
  { useStrict }: { useStrict: boolean }
): Promise<void> {
  const dist = joinPath(dir, 'dist');
  const file = joinPath(dist, 'index.js');

  await tryCatch(() => fs.mkdirAsync(dist));
  await fs.writeFileAsync(file, useStrict ? '\'use strict\';\n\n' : '', 'utf8');

  for (const [key, value] of assets) {
    switch (key) {
      case 'controllers':
        for (let name of value) {
          const path = joinPath('app', 'controllers', name);

          name = classify(underscore(name.replace(/\.js$/ig, '')));

          if (name !== 'Application') {
            name = pluralize(name);
          }

          name += 'Controller';

          await fs.appendFileAsync(file, exportStatement(name, path), 'utf8');
        }
        break;

      case 'models':
        for (let name of value) {
          const path = joinPath('app', 'models', name);
          name = classify(underscore(name.replace(/\.js$/ig, '')));

          await fs.appendFileAsync(file, exportStatement(name, path), 'utf8');
        }
        break;

      case 'migrations':
        for (let name of value) {
          const path = joinPath('db', 'migrate', name);
          name = camelize(
            underscore(name.replace(/\.js$/ig, '')).substr(17)
          , true);

          await fs.appendFileAsync(file,
            exportStatement(`up as ${name}Up`, path, false)
          , 'utf8');

          await fs.appendFileAsync(file,
            exportStatement(`down as ${name}Down`, path, false)
          , 'utf8');
        }
        break;

      case 'serializers':
        for (let name of value) {
          const path = joinPath('app', 'serializers', name);

          name = classify(underscore(name.replace(/\.js$/ig, '')));

          if (name !== 'Application') {
            name = pluralize(name);
          }

          name += 'Serializer';

          await fs.appendFileAsync(file, exportStatement(name, path), 'utf8');
        }
        break;

      default:
        if (typeof value === 'string') {
          await fs.appendFileAsync(file, exportStatement(key, value), 'utf8');
        }
    }
  }
}
