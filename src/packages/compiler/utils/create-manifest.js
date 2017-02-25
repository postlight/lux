// @flow
import { sep, posix, basename, join as joinPath } from 'path';

import { camelize, capitalize, pluralize } from 'inflection';

import { mkdir, writeFile, appendFile } from '../../fs';
import chain from '../../../utils/chain';
import tryCatch from '../../../utils/try-catch';
import underscore from '../../../utils/underscore';
import { compose } from '../../../utils/compose';

import formatName from './format-name';

/**
 * @private
 */
function createExportStatement(
  name: string,
  path: string,
  isDefault: boolean = true
): Buffer {
  const normalized = posix.join(...path.split(sep));
  let data;

  if (isDefault) {
    data = `export {\n  default as ${name}\n} from '../${normalized}';\n\n`;
  } else {
    data = `export {\n  ${name}\n} from '../${normalized}';\n\n`;
  }

  return Buffer.from(data);
}

/**
 * @private
 */
function createWriter(file: string) {
  const writerFor = (
    type: string,
    handleWrite: void | (value: string) => Promise<void>
  ) => (value: Array<string>) => {
    const formatSymbol = compose(str => str + capitalize(type), formatName);

    return Promise.all(
      value.map(item => {
        if (handleWrite) {
          return handleWrite(item);
        }

        const path = joinPath('app', pluralize(type), item);
        const symbol = formatSymbol(item);

        return appendFile(file, createExportStatement(symbol, path));
      })
    );
  };

  return {
    controllers: writerFor('controller'),
    serializers: writerFor('serializer'),

    models: writerFor('model', async item => {
      const path = joinPath('app', 'models', item);
      const name = formatName(item);

      return appendFile(file, createExportStatement(name, path));
    }),

    migrations: writerFor('migration', async (item) => {
      const path = joinPath('db', 'migrate', item);
      const name = chain(item)
        .pipe(str => basename(str, '.js'))
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
  await writeFile(file, Buffer.from(useStrict ? '\'use strict\';\n\n' : ''));

  await Promise.all(
    Array
      .from(assets)
      .map(([key, value]) => {
        const write = Reflect.get(writer, key);

        if (write) {
          return write(value);
        } else if (!write && typeof value === 'string') {
          return appendFile(file, createExportStatement(key, value));
        }

        return Promise.resolve();
      })
  );
}
