// @flow
import { join as joinPath } from 'path';

import { camelize, capitalize, pluralize } from 'inflection';

import { mkdir, writeFile, appendFile } from '../../fs';
import chain from '../../../utils/chain';
import tryCatch from '../../../utils/try-catch';
import underscore from '../../../utils/underscore';

import stripExt from './strip-ext';
import formatName from './format-name';
import normalizePath from './normalize-path';

/**
 * @private
 */
function createExportStatement(
  name: string,
  path: string,
  isDefault: boolean = true
): string {
  const normalized = normalizePath(path);

  if (isDefault) {
    return `export {\n  default as ${name}\n} from '../${normalized}';\n\n`;
  }

  return `export {\n  ${name}\n} from '../${normalized}';\n\n`;
}

/**
 * @private
 */
function createWriter(file: string) {
  const writerFor = (
    type: string,
    handleWrite: void | (value: string) => Promise<void>
  ) => async (value: string | Array<string>) => {
    for (const item of value) {
      if (handleWrite) {
        await handleWrite(item);
      } else {
        const path = joinPath('app', pluralize(type), item);
        const name = chain(item)
          .pipe(formatName)
          .pipe(str => str + capitalize(type))
          .value();

        await appendFile(file, createExportStatement(name, path));
      }
    }
  };

  return {
    controllers: writerFor('controller'),
    serializers: writerFor('serializer'),

    models: writerFor('model', async (item) => {
      const path = joinPath('app', 'models', item);
      const name = formatName(item);

      return await appendFile(file, createExportStatement(name, path));
    }),

    migrations: writerFor('migration', async (item) => {
      const path = joinPath('db', 'migrate', item);
      const name = chain(item)
        .pipe(stripExt)
        .pipe(underscore)
        .pipe(str => str.substr(17))
        .pipe(str => camelize(str, true))
        .value();

      await appendFile(file, createExportStatement(
        `up as ${name}Up`,
        path,
        false
      ));

      await appendFile(file, createExportStatement(
        `down as ${name}Down`,
        path,
        false
      ));
    })
  };
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
  const writer = createWriter(file);

  await tryCatch(() => mkdir(dist));
  await writeFile(file, useStrict ? '\'use strict\';\n\n' : '');

  for (const [key, value] of assets) {
    const write = Reflect.get(writer, key);

    if (write) {
      await write(value);
    } else if (!write && typeof value === 'string') {
      await appendFile(file, createExportStatement(key, value));
    }
  }
}
