import moment from 'moment';
import { green } from 'colors/safe';
import { pluralize } from 'inflection';

import fs from '../../fs';

import modelTemplate from '../templates/model';
import migrationTemplate from '../templates/migration';
import serializerTemplate from '../templates/serializer';
import controllerTemplate from '../templates/controller';

export async function generateType(type, name, pwd) {
  let path, data;

  type = type.toLowerCase();

  switch (type) {
    case 'model':
      data = modelTemplate(name);
      break;

    case 'migration':
      data = migrationTemplate();
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
    path = `db/migrate/${moment().format('YYYYMMDDHHmmssSS')}-${name}.js`;
  } else {
    path = `app/${pluralize(type)}/${name}.js`;
  }

  await fs.writeFile(`${pwd}/${path}`, data, 'utf8');

  console.log(`${green('create')} ${path}`);
}

export default async function generate(type, name, pwd) {
  pwd = pwd ? pwd : process.env.PWD;

  if (type === 'resource') {
    await Promise.all([
      generateType('model', name, pwd),
      generateType('serializer', name, pwd),
      generateType('controller', name, pwd)
    ]);
  } else {
    await generateType(type, name, pwd);
  }
}
