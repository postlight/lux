// @flow
import { posix, join as joinPath } from 'path';

import { green } from 'chalk';
import { pluralize, singularize } from 'inflection';

import { NAMESPACED_RESOURCE_MESSAGE } from '../constants';
import { generateTimestamp } from '../../../database';
import { exists, readFile, writeFile } from '../../../fs';
import modelTemplate from '../../templates/model';
import serializerTemplate from '../../templates/serializer';
import controllerTemplate from '../../templates/controller';
import emptyMigrationTemplate from '../../templates/empty-migration';
import modelMigrationTemplate from '../../templates/model-migration';
import middlewareTemplate from '../../templates/middleware';
import utilTemplate from '../../templates/util';
import chain from '../../../../utils/chain';
import type { Generator$opts } from '../index';

import log from './log';
import createGenerator from './create-generator';
import { createConflictResolver, detectConflict } from './migration-conflict';

/**
 * @private
 */
export async function controller(opts: Generator$opts): Promise<void> {
  const { cwd } = opts;
  let { name } = opts;

  const dir = joinPath('app', 'controllers');
  const generate = createGenerator({
    dir,
    template: controllerTemplate
  });

  if (!name.endsWith('application')) {
    name = pluralize(name);
  }

  await generate({
    ...opts,
    cwd,
    name
  });

  const namespace = posix.dirname(name);

  if (namespace === '.') {
    return;
  }

  const hasParent = await exists(
    joinPath(cwd, dir, namespace.split('/'), 'application.js')
  );

  if (!hasParent) {
    await controller({
      ...opts,
      cwd,
      name: `${namespace}/application`,
      attrs: []
    });
  }
}

/**
 * @private
 */
export async function serializer(opts: Generator$opts): Promise<void> {
  const { cwd } = opts;
  let { name } = opts;

  const dir = joinPath('app', 'serializers');
  const generate = createGenerator({
    dir,
    template: serializerTemplate
  });

  if (!name.endsWith('application')) {
    name = pluralize(name);
  }

  await generate({
    ...opts,
    cwd,
    name
  });

  const namespace = posix.dirname(name);

  if (namespace === '.') {
    return;
  }

  const hasParent = await exists(
    joinPath(cwd, dir, ...[...namespace.split('/'), 'application.js'])
  );

  if (!hasParent) {
    await serializer({
      ...opts,
      cwd,
      name: `${namespace}/application`,
      attrs: []
    });
  }
}

/**
 * @private
 */
export function migration(opts: Generator$opts) {
  const { cwd, onConflict } = opts;
  let { name } = opts;

  const dir = joinPath('db', 'migrate');
  const generate = createGenerator({
    dir,
    template: emptyMigrationTemplate,
    hasConflict: detectConflict
  });

  name = chain(name)
    .pipe(posix.basename)
    .pipe(str => `${generateTimestamp()}-${str}`)
    .value();

  return generate({
    ...opts,
    cwd,
    name,
    onConflict: createConflictResolver({
      cwd,
      onConflict
    })
  });
}

/**
 * @private
 */
export function modelMigration(opts: Generator$opts) {
  const { cwd, onConflict } = opts;
  let { name } = opts;

  const dir = joinPath('db', 'migrate');
  const generate = createGenerator({
    dir,
    template: modelMigrationTemplate,
    hasConflict: detectConflict
  });

  name = chain(name)
    .pipe(posix.basename)
    .pipe(pluralize)
    .pipe(str => `${generateTimestamp()}-create-${str}`)
    .value();

  return generate({
    ...opts,
    cwd,
    name,
    onConflict: createConflictResolver({
      cwd,
      onConflict
    })
  });
}

/**
 * @private
 */
export async function model(opts: Generator$opts): Promise<void> {
  let { name } = opts;
  const generate = createGenerator({
    dir: joinPath('app', 'models'),
    template: modelTemplate
  });

  await modelMigration({ name, ...opts });

  name = chain(name)
    .pipe(posix.basename)
    .pipe(singularize)
    .value();

  return generate({
    ...opts,
    name
  });
}

/**
 * @private
 */
export function middleware(opts: Generator$opts) {
  let { name } = opts;
  const parts = name.split('/');

  name = parts.pop() || name;

  const generate = createGenerator({
    dir: joinPath('app', 'middleware', ...parts),
    template: middlewareTemplate
  });

  return generate({
    ...opts,
    name
  });
}

/**
 * @private
 */
export function util(opts: Generator$opts) {
  let { name } = opts;
  const parts = name.split('/');

  name = parts.pop() || name;

  const generate = createGenerator({
    dir: joinPath('app', 'utils', ...parts),
    template: utilTemplate
  });

  return generate({
    ...opts,
    name
  });
}

/**
 * @private
 */
export async function resource(opts: Generator$opts) {
  await model(opts);
  await controller(opts);
  await serializer(opts);

  if (posix.dirname(opts.name) === '.') {
    log(NAMESPACED_RESOURCE_MESSAGE);
    return;
  }

  const path = joinPath(opts.cwd, 'app', 'routes.js');
  const routes = chain(await readFile(path))
    .pipe(buf => buf.toString('utf8'))
    .pipe(str => str.split('\n'))
    .pipe(lines => lines.reduce((result, line, index, arr) => {
      const closeIndex = arr.lastIndexOf('}');
      let str = result;

      if (line && index <= closeIndex) {
        str += `${line}\n`;
      }

      if (index + 1 === closeIndex) {
        str += `  this.resource('${pluralize(opts.name)}');\n`;
      }

      return str;
    }, ''))
    .value();

  await writeFile(path, routes);
  log(`${green('update')} app/routes.js`);
}
