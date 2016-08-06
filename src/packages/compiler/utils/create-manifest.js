// @flow
import { join as joinPath } from 'path';
import { camelize, classify, pluralize } from 'inflection';

import { BACKSLASH } from '../constants';
import { mkdir, writeFile, appendFile } from '../../fs';

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

  await tryCatch(() => mkdir(dist));
  await writeFile(file, useStrict ? '\'use strict\';\n\n' : '');

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

          await appendFile(file, exportStatement(name, path));
        }
        break;

      case 'models':
        for (let name of value) {
          const path = joinPath('app', 'models', name);
          name = classify(underscore(name.replace(/\.js$/ig, '')));

          await appendFile(file, exportStatement(name, path));
        }
        break;

      case 'migrations':
        for (let name of value) {
          const path = joinPath('db', 'migrate', name);
          name = camelize(
            underscore(name.replace(/\.js$/ig, '')).substr(17)
          , true);

          await appendFile(
            file,
            exportStatement(`up as ${name}Up`, path, false)
          );

          await appendFile(
            file,
            exportStatement(`down as ${name}Down`, path, false)
          );
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

          await appendFile(file, exportStatement(name, path));
        }
        break;

      default:
        if (typeof value === 'string') {
          await appendFile(file, exportStatement(key, value));
        }
    }
  }
}
