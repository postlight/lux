import { red, green, yellow } from 'chalk';
import { pluralize, singularize } from 'inflection';
import { createInterface } from 'readline';

import { CWD } from '../../../constants';

import { generateTimestamp } from '../../database';
import { rmrf, exists, readdir, readFile, writeFile } from '../../fs';

import modelTemplate from '../templates/model';
import serializerTemplate from '../templates/serializer';
import controllerTemplate from '../templates/controller';
import emptyMigrationTemplate from '../templates/empty-migration';
import modelMigrationTemplate from '../templates/model-migration';
import middlewareTemplate from '../templates/middleware';
import utilTemplate from '../templates/util';

import indent from '../utils/indent';

/**
 * @private
 */
export async function generateType(type, name, cwd, attrs = []) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt('');

  let path, data;

  type = type.toLowerCase();

  switch (type) {
    case 'model':
      data = modelTemplate(name, attrs);
      break;

    case 'migration':
      data = emptyMigrationTemplate();
      break;

    case 'model-migration':
      data = modelMigrationTemplate(name, attrs);
      break;

    case 'serializer':
      data = serializerTemplate(name, attrs);
      break;

    case 'controller':
      data = controllerTemplate(name, attrs);
      break;

    case 'middleware':
      data = middlewareTemplate(name);
      break;

    case 'util':
      data = utilTemplate(name);
      break;
  }

  if (type === 'model') {
    name = singularize(name);
  }

  if (type !== 'model' && type !== 'migration' && type !== 'middleware' &&
      type !== 'util' && name !== 'application') {
    name = pluralize(name);
  }

  if (type === 'migration') {
    const timestamp = generateTimestamp();

    path = `db/migrate/${timestamp}-${name}.js`;
  } else if (type === 'model-migration') {
    const timestamp = generateTimestamp();

    path = `db/migrate/${timestamp}-create-${pluralize(name)}.js`;
  } else if (type === 'middleware') {
    path = `app/${type}/${name}.js`;
  } else {
    path = `app/${pluralize(type)}/${name}.js`;
  }

  let doesExist;
  const isMigration = /^(model-)?migration$/.test(type);

  if (isMigration) {
    const regexp = new RegExp(`^\\d+-${path.split('/').pop().substr(17)}$`);

    doesExist = await exists(regexp, `${cwd}/db/migrate`);
  } else {
    doesExist = await exists(`${cwd}/${path}`);
  }

  if (doesExist) {
    const overwrite = await new Promise(resolve => {
      rl.question(
        `${green('?')} ${red('Overwrite')} ${path}? (Y/n) `,
        answer => resolve(/^y(es)?$/i.test(answer))
      );
    });

    if (overwrite) {
      if (isMigration) {
        const migrations = await readdir(`${cwd}/db/migrate`);
        const isModelMigration = type === 'model-migration';

        const oldName = migrations.find(file => {
          file = file.substr(17);
          return file === `${isModelMigration ? 'create-' : ''}${name}.js`;
        });

        if (oldName) {
          const oldPath = `db/migrate/${oldName}`;

          await rmrf(`${cwd}/${oldPath}`);
          console.log(`${red('remove')} ${oldPath}`);
        }

        await writeFile(`${cwd}/${path}`, data);
        console.log(`${green('create')} ${path}`);
      } else {
        await writeFile(`${cwd}/${path}`, data);
        console.log(`${yellow('overwrite')} ${path}`);
      }
    } else {
      console.log(`${yellow('skip')} ${path}`);
    }
  } else {
    await writeFile(`${cwd}/${path}`, data);
    console.log(`${green('create')} ${path}`);
  }

  rl.close();
}

/**
 * @private
 */
export async function generate({
  type,
  name,
  cwd = CWD,
  attrs = []
}: {
  cwd: string;
  type: string;
  name: string;
  attrs: Array<string>
}) {
  if (type === 'resource') {
    const routes = (await readFile(`${cwd}/app/routes.js`, 'utf8'))
      .split('\n')
      .reduce((str, line, index, array) => {
        const closeIndex = array.lastIndexOf('}');

        if (line.length && index <= closeIndex) {
          str += `${line}\n`;
        }

        if (index + 1 === closeIndex) {
          str += `${indent(2)}this.resource('${pluralize(name)}');\n`;
        }

        return str;
      }, '');

    await generateType('model', name, cwd, attrs);
    await generateType('model-migration', name, cwd, attrs);
    await generateType('serializer', name, cwd, attrs);
    await generateType('controller', name, cwd, attrs);

    await writeFile(`${cwd}/app/routes.js`, routes);
    console.log(`${green('update')} app/routes.js`);
  } else if (type === 'model') {
    await generateType(type, name, cwd, attrs);
    await generateType('model-migration', name, cwd, attrs);
  } else {
    await generateType(type, name, cwd, attrs);
  }
}
