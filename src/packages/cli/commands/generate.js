import Promise from 'bluebird';
import moment from 'moment';
import { red, green, yellow } from 'chalk';
import { pluralize } from 'inflection';
import { createInterface } from 'readline';

import fs, { rmrf, exists } from '../../fs';

import modelTemplate from '../templates/model';
import serializerTemplate from '../templates/serializer';
import controllerTemplate from '../templates/controller';
import emptyMigrationTemplate from '../templates/empty-migration';
import modelMigrationTemplate from '../templates/model-migration';

import indent from '../utils/indent';

const { stdin, stdout, env: { PWD } } = process;

export async function generateType(type, name, pwd, attrs = []) {
  const rl = createInterface({
    input: stdin,
    output: stdout
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
  }

  if (type !== 'model' && type !== 'migration' && name !== 'application') {
    name = pluralize(name);
  }

  if (type === 'migration') {
    const timestamp = moment().format('YYYYMMDDHHmmssSS');

    path = `db/migrate/${timestamp}-${name}.js`;
  } else if (type === 'model-migration') {
    const timestamp = moment().format('YYYYMMDDHHmmssSS');

    path = `db/migrate/${timestamp}-create-${pluralize(name)}.js`;
  } else {
    path = `app/${pluralize(type)}/${name}.js`;
  }

  let doesExist;
  const isMigration = /^(model-)?migration$/.test(type);

  if (isMigration) {
    const regexp = new RegExp(`^\\d+-${path.split('/').pop().substr(17)}$`);

    doesExist = await exists(regexp, `${pwd}/db/migrate`);
  } else {
    doesExist = await exists(`${pwd}/${path}`);
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
        const migrations = await fs.readdirAsync(`${pwd}/db/migrate`);
        const isModelMigration = type === 'model-migration';

        const oldName = migrations.find(file => {
          file = file.substr(17);
          return file === `${isModelMigration ? 'create-' : ''}${name}.js`;
        });

        if (oldName) {
          const oldPath = `db/migrate/${oldName}`;

          await rmrf(`${pwd}/${oldPath}`);
          console.log(`${red('remove')} ${oldPath}`);
        }

        await fs.writeFileAsync(`${pwd}/${path}`, `${data}\n`, 'utf8');
        console.log(`${green('create')} ${path}`);
      } else {
        await fs.writeFileAsync(`${pwd}/${path}`, `${data}\n`, 'utf8');
        console.log(`${yellow('overwrite')} ${path}`);
      }
    } else {
      console.log(`${yellow('skip')} ${path}`);
    }
  } else {
    await fs.writeFileAsync(`${pwd}/${path}`, `${data}\n`, 'utf8');
    console.log(`${green('create')} ${path}`);
  }

  rl.close();
}

export default async function generate(type, name, pwd = PWD, attrs = []) {
  if (type === 'resource') {
    const routes = (await fs.readFileAsync(`${pwd}/app/routes.js`, 'utf8'))
      .split('\n')
      .reduce((str, line, index, array) => {
        const closeIndex = array.lastIndexOf('};');

        if (index <= closeIndex) {
          str += `${line}\n`;
        } if (index + 1 === closeIndex) {
          str += `${indent(2)}resource('${pluralize(name)}');\n`;
        }

        return str;
      }, '');

    await generateType('model', name, pwd, attrs);
    await generateType('model-migration', name, pwd, attrs);
    await generateType('serializer', name, pwd, attrs);
    await generateType('controller', name, pwd, attrs);

    await fs.writeFileAsync(`${pwd}/app/routes.js`, routes, 'utf8');
    console.log(`${green('update')} app/routes.js`);
  } else if (type === 'model') {
    await generateType(type, name, pwd, attrs);
    await generateType('model-migration', name, pwd, attrs);
  } else {
    await generateType(type, name, pwd, attrs);
  }
}
