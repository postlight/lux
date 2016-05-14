import moment from 'moment';
import { green } from 'colors/safe';
import { pluralize } from 'inflection';

import fs from '../../fs';

import modelTemplate from '../templates/model';
import serializerTemplate from '../templates/serializer';
import controllerTemplate from '../templates/controller';
import emptyMigrationTemplate from '../templates/empty-migration';
import modelMigrationTemplate from '../templates/model-migration';

import indent from '../utils/indent';

const { env: { PWD } } = process;

export async function generateType(type, name, pwd, attrs = []) {
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

  await fs.writeFileAsync(`${pwd}/${path}`, `${data}\n`, 'utf8');
  console.log(`${green('create')} ${path}`);
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

    await Promise.all([
      generateType('model', name, pwd, attrs),
      generateType('model-migration', name, pwd, attrs),
      generateType('serializer', name, pwd, attrs),
      generateType('controller', name, pwd, attrs),
      fs.writeFileAsync(`${pwd}/app/routes.js`, routes, 'utf8')
    ]);
  } else if (type === 'model') {
    await Promise.all([
      generateType(type, name, pwd, attrs),
      generateType('model-migration', name, pwd, attrs)
    ]);
  } else {
    await generateType(type, name, pwd, attrs);
  }
}
