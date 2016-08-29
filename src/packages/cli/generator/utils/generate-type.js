// @flow
import { green } from 'chalk';
import { join as joinPath } from 'path';
import { pluralize, singularize } from 'inflection';

import { NAMESPACED_RESOURCE_MESSAGE } from '../constants';

import { stripNamespaces, getNamespaceKey } from '../../../loader';
import { generateTimestamp } from '../../../database';
import { exists, readFile, writeFile } from '../../../fs';

import modelTemplate from '../../templates/model';
import serializerTemplate from '../../templates/serializer';
import controllerTemplate from '../../templates/controller';
import emptyMigrationTemplate from '../../templates/empty-migration';
import modelMigrationTemplate from '../../templates/model-migration';
import middlewareTemplate from '../../templates/middleware';
import utilTemplate from '../../templates/util';

import log from './log';
import chain from '../../../../utils/chain';
import createGenerator from './create-generator';
import { createConflictResolver, detectConflict } from './migration-conflict';

import type { Generator$opts } from '../index';

/**
 * @private
 */
export async function controller({
  cwd,
  name,
  ...opts
}: Generator$opts): Promise<void> {
  const dir = joinPath('app', 'controllers');
  const generate = createGenerator({
    dir,
    template: controllerTemplate
  });

  if (!name.endsWith('application')) {
    name = pluralize(name);
  }

  await generate({
    cwd,
    name,
    ...opts
  });

  const namespace = getNamespaceKey(name);

  if (namespace !== 'root') {
    const hasParent = await exists(
      joinPath(cwd, dir, ...[...namespace.split('/'), 'application.js'])
    );

    if (!hasParent) {
      await controller({
        cwd,
        ...opts,
        name: `${namespace}/application`,
        attrs: []
      });
    }
  }
}

/**
 * @private
 */
export async function serializer({
  cwd,
  name,
  ...opts
}: Generator$opts): Promise<void> {
  const dir = joinPath('app', 'serializers');
  const generate = createGenerator({
    dir,
    template: serializerTemplate
  });

  if (!name.endsWith('application')) {
    name = pluralize(name);
  }

  await generate({
    cwd,
    name,
    ...opts
  });

  const namespace = getNamespaceKey(name);

  if (namespace !== 'root') {
    const hasParent = await exists(
      joinPath(cwd, dir, ...[...namespace.split('/'), 'application.js'])
    );

    if (!hasParent) {
      await serializer({
        cwd,
        ...opts,
        name: `${namespace}/application`,
        attrs: []
      });
    }
  }
}

/**
 * @private
 */
export function migration({ cwd, name, onConflict, ...opts }: Generator$opts) {
  const dir = joinPath('db', 'migrate');
  const generate = createGenerator({
    dir,
    template: emptyMigrationTemplate,
    hasConflict: detectConflict
  });

  name = chain(name)
    .pipe(stripNamespaces)
    .pipe(str => `${generateTimestamp()}-${str}`)
    .value();

  return generate({
    cwd,
    name,
    ...opts,
    onConflict: createConflictResolver({
      cwd,
      onConflict
    })
  });
}

/**
 * @private
 */
export function modelMigration({
  cwd,
  name,
  onConflict,
  ...opts
}: Generator$opts) {
  const dir = joinPath('db', 'migrate');
  const generate = createGenerator({
    dir,
    template: modelMigrationTemplate,
    hasConflict: detectConflict
  });

  name = chain(name)
    .pipe(stripNamespaces)
    .pipe(pluralize)
    .pipe(str => `${generateTimestamp()}-create-${str}`)
    .value();

  return generate({
    cwd,
    name,
    ...opts,
    onConflict: createConflictResolver({
      cwd,
      onConflict
    })
  });
}

/**
 * @private
 */
export async function model({ name, ...opts }: Generator$opts): Promise<void> {
  const generate = createGenerator({
    dir: joinPath('app', 'models'),
    template: modelTemplate
  });

  await modelMigration({ name, ...opts });

  name = chain(name)
    .pipe(stripNamespaces)
    .pipe(singularize)
    .value();

  return generate({
    name,
    ...opts
  });
}

/**
 * @private
 */
export function middleware({ name, ...opts }: Generator$opts) {
  const parts = name.split('/');
  name = parts.pop() || name;

  const generate = createGenerator({
    dir: joinPath('app', 'middleware', ...parts),
    template: middlewareTemplate
  });

  return generate({
    name,
    ...opts
  });
}

/**
 * @private
 */
export function util({ name, ...opts }: Generator$opts) {
  const parts = name.split('/');
  name = parts.pop() || name;

  const generate = createGenerator({
    dir: joinPath('app', 'utils', ...parts),
    template: utilTemplate
  });

  return generate({
    name,
    ...opts
  });
}

/**
 * @private
 */
export async function resource(opts: Generator$opts) {
  await model(opts);
  await controller(opts);
  await serializer(opts);

  if (getNamespaceKey(opts.name) !== 'root') {
    log(NAMESPACED_RESOURCE_MESSAGE);
  } else {
    const path = joinPath(opts.cwd, 'app', 'routes.js');
    const routes = chain(await readFile(path))
      .pipe(buf => buf.toString('utf8'))
      .pipe(str => str.split('\n'))
      .pipe(lines => lines.reduce((result, line, index, arr) => {
        const closeIndex = arr.lastIndexOf('}');

        if (index <= closeIndex) {
          result += `${line}\n`;
        }

        if (index + 1 === closeIndex) {
          result += `\n  this.resource('${pluralize(opts.name)}');\n`;
        }

        return result;
      }, ''))
      .value();

    await writeFile(path, routes);
    log(`${green('update')} app/routes.js`);
  }
}
