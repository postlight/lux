import moment from 'moment';
import { green } from 'colors/safe';
import { pluralize } from 'inflection';

import fs from '../../fs';

import modelTemplate from '../templates/model';
import serializerTemplate from '../templates/serializer';
import controllerTemplate from '../templates/controller';
import emptyMigrationTemplate from '../templates/empty-migration';
import modelMigrationTemplate from '../templates/model-migration';

const { env: { PWD } } = process;

export async function generateType(type, name, pwd, args = []) {
  let path, data;

  type = type.toLowerCase();

  switch (type) {
    case 'model':
      data = modelTemplate(name);
      break;

    case 'migration':
      data = emptyMigrationTemplate();
      break;

    case 'model-migration':
      data = modelMigrationTemplate(name, args);
      break;

    case 'serializer':
      data = serializerTemplate(name);
      break;

    case 'controller':
      data = controllerTemplate(name);
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

export default async function generate(type, name, pwd = PWD, args = []) {
  if (type === 'resource') {
    await Promise.all([
      generateType('model', name, pwd, args),
      generateType('model-migration', name, pwd, args),
      generateType('serializer', name, pwd, args),
      generateType('controller', name, pwd, args)
    ]);
  } else {
    await generateType(type, name, pwd, args);
  }
}
